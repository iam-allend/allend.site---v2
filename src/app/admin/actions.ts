'use server';

// All admin writes. Each action re-checks the session (requireAdmin), validates with
// the shared zod schemas, writes through RLS, then refreshes cached public content.

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { CONTENT_TAG } from '@/lib/content';
import { dbError, formObject, invalidState, type FormState } from '@/lib/forms';
import {
  educationSchema, experienceSchema, profileSchema, projectSchema, skillGroupSchema,
} from '@/lib/validation';
import { MEDIA_BUCKET, MEDIA_ROOT } from '@/lib/format';

type Db = Awaited<ReturnType<typeof requireAdmin>>['db'];

/** Deletes v2 uploads only; migrated v1 files (other bucket or outside v2/) are left alone. */
async function removeOwnFiles(db: Db, files: { bucket: string; path: string }[]) {
  const own = files.filter((f) => f.bucket === MEDIA_BUCKET && f.path.startsWith(`${MEDIA_ROOT}/`)).map((f) => f.path);
  if (own.length) await db.storage.from(MEDIA_BUCKET).remove(own);
}

function published() {
  revalidateTag(CONTENT_TAG);
  revalidatePath('/admin', 'layout');
}

/* ---------- projects ---------- */

export async function saveProject(id: string | null, _: FormState, form: FormData): Promise<FormState> {
  const { db } = await requireAdmin();
  const parsed = projectSchema.safeParse(formObject(form, ['featured']));
  if (!parsed.success) return invalidState(parsed.error);

  if (id) {
    const { error } = await db.from('v2_projects').update(parsed.data).eq('id', id);
    if (error) return dbError(error.message);
    published();
    return { ok: 'Proyek tersimpan.' };
  }

  const { data, error } = await db.from('v2_projects').insert(parsed.data).select('id').single();
  if (error) return dbError(error.message);
  published();
  redirect(`/admin/projects/${data.id}?toast=created`);
}

export async function deleteProject(id: string) {
  const { db } = await requireAdmin();
  const { data: images } = await db.from('v2_project_images').select('bucket, path').eq('project_id', id);
  await removeOwnFiles(db, images ?? []);
  await db.from('v2_projects').delete().eq('id', id);
  published();
  redirect('/admin/projects?toast=deleted');
}

export async function addProjectImage(projectId: string, path: string, width: number, height: number) {
  const { db } = await requireAdmin();
  if (!path.startsWith(`${MEDIA_ROOT}/projects/${projectId}/`)) throw new Error('Unexpected upload path');
  const { count } = await db.from('v2_project_images').select('id', { count: 'exact', head: true }).eq('project_id', projectId);
  await db.from('v2_project_images').insert({ project_id: projectId, path, width, height, sort: count ?? 0 });
  published();
}

export async function deleteProjectImage(imageId: string) {
  const { db } = await requireAdmin();
  const { data } = await db.from('v2_project_images').delete().eq('id', imageId).select('bucket, path').single();
  await removeOwnFiles(db, data ? [data] : []);
  published();
}

/** Swap an image with its neighbour (direction -1 = earlier). */
export async function moveProjectImage(projectId: string, imageId: string, direction: -1 | 1) {
  const { db } = await requireAdmin();
  const { data: images } = await db.from('v2_project_images').select('id, sort').eq('project_id', projectId).order('sort');
  if (!images) return;
  const from = images.findIndex((i) => i.id === imageId);
  const to = from + direction;
  if (from < 0 || to < 0 || to >= images.length) return;
  [images[from], images[to]] = [images[to], images[from]];
  await Promise.all(images.map((img, sort) => db.from('v2_project_images').update({ sort }).eq('id', img.id)));
  published();
}

/* ---------- experience & education ---------- */

export async function saveExperience(id: string | null, _: FormState, form: FormData): Promise<FormState> {
  const { db } = await requireAdmin();
  const parsed = experienceSchema.safeParse(formObject(form, ['on_home']));
  if (!parsed.success) return invalidState(parsed.error);
  const { error } = id
    ? await db.from('v2_experiences').update(parsed.data).eq('id', id)
    : await db.from('v2_experiences').insert(parsed.data);
  if (error) return dbError(error.message);
  published();
  redirect('/admin/history?toast=saved');
}

export async function deleteExperience(id: string) {
  const { db } = await requireAdmin();
  await db.from('v2_experiences').delete().eq('id', id);
  published();
}

export async function saveEducation(id: string | null, _: FormState, form: FormData): Promise<FormState> {
  const { db } = await requireAdmin();
  const parsed = educationSchema.safeParse(formObject(form));
  if (!parsed.success) return invalidState(parsed.error);
  const { error } = id
    ? await db.from('v2_education').update(parsed.data).eq('id', id)
    : await db.from('v2_education').insert(parsed.data);
  if (error) return dbError(error.message);
  published();
  redirect('/admin/history?toast=saved');
}

export async function deleteEducation(id: string) {
  const { db } = await requireAdmin();
  await db.from('v2_education').delete().eq('id', id);
  published();
}

/* ---------- skills ---------- */

export async function saveSkillGroup(id: string | null, _: FormState, form: FormData): Promise<FormState> {
  const { db } = await requireAdmin();
  const parsed = skillGroupSchema.safeParse(formObject(form));
  if (!parsed.success) return invalidState(parsed.error);
  const { skills, ...group } = parsed.data;

  let groupId = id;
  if (groupId) {
    const { error } = await db.from('v2_skill_groups').update(group).eq('id', groupId);
    if (error) return dbError(error.message);
  } else {
    const { data, error } = await db.from('v2_skill_groups').insert(group).select('id').single();
    if (error) return dbError(error.message);
    groupId = data.id;
  }

  // The textarea is the source of truth for the group's skills.
  await db.from('v2_skills').delete().eq('group_id', groupId);
  if (skills.length) {
    const { error } = await db.from('v2_skills').insert(skills.map((name, sort) => ({ group_id: groupId, name, sort })));
    if (error) return dbError(error.message);
  }
  published();
  return id ? { ok: 'Grup tersimpan.' } : redirect('/admin/skills?toast=created');
}

export async function deleteSkillGroup(id: string) {
  const { db } = await requireAdmin();
  await db.from('v2_skill_groups').delete().eq('id', id);
  published();
}

/* ---------- messages ---------- */

export async function setMessageRead(id: string, read: boolean) {
  const { db } = await requireAdmin();
  await db.from('v2_messages').update({ read_at: read ? new Date().toISOString() : null }).eq('id', id);
  revalidatePath('/admin', 'layout');
}

export async function setMessageArchived(id: string, archived: boolean) {
  const { db } = await requireAdmin();
  const now = new Date().toISOString();
  await db.from('v2_messages').update(archived ? { archived_at: now, read_at: now } : { archived_at: null }).eq('id', id);
  revalidatePath('/admin', 'layout');
}

export async function deleteMessage(id: string) {
  const { db } = await requireAdmin();
  await db.from('v2_messages').delete().eq('id', id);
  revalidatePath('/admin', 'layout');
}

/* ---------- profile ---------- */

export async function saveProfile(_: FormState, form: FormData): Promise<FormState> {
  const { db } = await requireAdmin();
  const parsed = profileSchema.safeParse(formObject(form, ['available']));
  if (!parsed.success) return invalidState(parsed.error);
  const { github, linkedin, instagram, ...profile } = parsed.data;
  const socials = Object.fromEntries(Object.entries({ github, linkedin, instagram }).filter(([, v]) => v));
  const { error } = await db.from('v2_profile').update({ ...profile, socials }).eq('id', 1);
  if (error) return dbError(error.message);
  published();
  return { ok: 'Profil tersimpan.' };
}

/** Points the profile at a newly uploaded avatar or CV and removes the old file. */
export async function setProfileFile(field: 'avatar_path' | 'cv_path', path: string | null) {
  const { db } = await requireAdmin();
  const prefix = `${MEDIA_ROOT}/${field === 'cv_path' ? 'cv' : 'avatar'}/`;
  if (path && !path.startsWith(prefix)) throw new Error('Unexpected upload path');
  const { data: current } = await db.from('v2_profile').select(field).eq('id', 1).single<Record<typeof field, string | null>>();
  await db.from('v2_profile').update({ [field]: path }).eq('id', 1);
  const old = current?.[field];
  if (old && old !== path) await removeOwnFiles(db, [{ bucket: MEDIA_BUCKET, path: old }]);
  published();
}
