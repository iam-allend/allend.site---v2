'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { l, tr } from '@/lib/i18n';
import { getLang } from '@/lib/lang';
import { createSessionClient } from '@/lib/supabase/server';

export type LoginState = { error?: string };

const schema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z.string().min(1).max(200),
  next: z.string().optional(),
});

const MESSAGES = {
  invalid: l('Email atau kata sandi salah.', 'Wrong email or password.'),
  denied: l('Akun ini tidak punya akses admin.', 'This account has no admin access.'),
};

export async function signIn(_: LoginState, form: FormData): Promise<LoginState> {
  const lang = await getLang();
  const parsed = schema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: tr(MESSAGES.invalid, lang) };

  const db = await createSessionClient();
  const { error } = await db.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password });
  if (error) return { error: tr(MESSAGES.invalid, lang) };

  const { data: isAdmin } = await db.rpc('v2_is_admin');
  if (!isAdmin) {
    await db.auth.signOut();
    return { error: tr(MESSAGES.denied, lang) };
  }

  // Only allow internal admin paths as the post-login destination.
  const next = parsed.data.next;
  redirect(next && /^\/admin(\/|$)/.test(next) ? next : '/admin');
}
