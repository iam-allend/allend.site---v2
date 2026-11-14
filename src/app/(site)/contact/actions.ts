'use server';

import { headers } from 'next/headers';
import { tr } from '@/lib/i18n';
import { getLang } from '@/lib/lang';
import { copy } from '@/lib/copy';
import { publicDb } from '@/lib/supabase/public';
import { messageSchema } from '@/lib/validation';

export type ContactState = {
  status: 'idle' | 'sent' | 'error';
  firstName?: string;
  fields?: Partial<Record<'name' | 'email' | 'body', string>>;
  error?: string;
};

/** Hash of the sender's IP so the database can rate-limit without storing the address. */
async function senderHash() {
  const h = await headers();
  const ip = h.get('x-forwarded-for')?.split(',')[0].trim() || h.get('x-real-ip') || 'unknown';
  const data = new TextEncoder().encode(`${ip}:${process.env.MESSAGE_SALT ?? 'allend'}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Buffer.from(digest).toString('hex');
}

export async function sendMessage(_: ContactState, form: FormData): Promise<ContactState> {
  const lang = await getLang();
  const errors = copy.contact.errors;

  // Honeypot: real visitors never fill this hidden field.
  if (form.get('website')) return { status: 'sent', firstName: '' };

  const parsed = messageSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) {
    const fields: ContactState['fields'] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof typeof errors;
      if (key === 'name' || key === 'email' || key === 'body') fields[key] = tr(errors[key], lang);
    }
    return { status: 'error', fields };
  }

  const m = parsed.data;
  const { error } = await publicDb.rpc('v2_submit_message', {
    p_topic: m.topic,
    p_name: m.name,
    p_email: m.email,
    p_organization: m.organization,
    p_body: m.body,
    p_sender_hash: await senderHash(),
  });

  if (error) {
    const limited = error.message.includes('rate_limited');
    if (!limited) console.error('submit_message failed:', error.message);
    return { status: 'error', error: tr(limited ? errors.rate : errors.server, lang) };
  }
  return { status: 'sent', firstName: m.name.split(/\s+/)[0] };
}
