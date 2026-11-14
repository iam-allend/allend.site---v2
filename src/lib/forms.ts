import type { ZodError } from 'zod';

/** Result shape every admin action returns to <AdminForm>. */
export type FormState = { error?: string; invalid?: string[]; ok?: string };

/**
 * FormData → plain object. Dotted names nest one level ("title.id" → { title: { id } }).
 * Names listed in `booleans` become true/false from checkbox presence.
 */
export function formObject(form: FormData, booleans: string[] = []) {
  const out: Record<string, unknown> = {};
  for (const [key, raw] of form.entries()) {
    if (typeof raw !== 'string' || key.startsWith('$')) continue;
    const [head, tail] = key.split('.');
    if (tail) {
      const group = (out[head] ??= {}) as Record<string, string>;
      group[tail] = raw;
    } else {
      out[key] = raw;
    }
  }
  for (const name of booleans) out[name] = form.get(name) === 'on';
  return out;
}

/** Turn a ZodError into a short message plus the input names to highlight. */
export function invalidState(error: ZodError): FormState {
  const invalid = [...new Set(error.issues.map((i) => {
    const [head] = i.path;
    return String(head);
  }))];
  return { error: 'Periksa kembali kolom yang ditandai.', invalid };
}

export const dbError = (message: string): FormState => {
  if (message.includes('duplicate key')) return { error: 'Slug sudah dipakai proyek lain.', invalid: ['slug'] };
  return { error: `Gagal menyimpan: ${message}` };
};
