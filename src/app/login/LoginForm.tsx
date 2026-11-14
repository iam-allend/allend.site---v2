'use client';

import { useState } from 'react';
import { useFormAction } from '@/lib/use-form-action';
import { signIn, type LoginState } from './actions';

type Text = { title: string; lead: string; email: string; password: string; show: string; hide: string; submit: string; pending: string };

export function LoginForm({ text, next, notice }: { text: Text; next?: string; notice?: string }) {
  const { state, onSubmit, pending } = useFormAction<LoginState>(signIn, {});
  const [visible, setVisible] = useState(false);
  const error = state.error ?? notice;

  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <h2>{text.title}</h2>
      <p>{text.lead}</p>
      {error && <div className="alert on" role="alert">{error}</div>}
      <input type="hidden" name="next" value={next ?? ''} />
      <div className="field">
        <label htmlFor="l-email">{text.email}</label>
        <input id="l-email" name="email" type="email" autoComplete="username" required />
      </div>
      <div className="field">
        <label htmlFor="l-pass">{text.password}</label>
        <div className="pw">
          <input id="l-pass" name="password" type={visible ? 'text' : 'password'} autoComplete="current-password" required />
          <button type="button" aria-pressed={visible} onClick={() => setVisible((v) => !v)}>
            {visible ? text.hide : text.show}
          </button>
        </div>
      </div>
      <button className="btn solid" type="submit" disabled={pending}>{pending ? text.pending : text.submit}</button>
    </form>
  );
}
