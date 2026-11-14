'use client';

import { useState } from 'react';
import { ArrowRight } from '@/components/icons';
import { useFormAction } from '@/lib/use-form-action';
import { sendMessage, type ContactState } from './actions';

export type ContactCopy = {
  topic: string;
  topics: { value: string; label: string }[];
  name: string; namePh: string;
  email: string; emailPh: string;
  org: string; optional: string;
  message: string; messagePh: string;
  privacy: string; send: string; sending: string;
  thanks: string; sentBody: string; another: string;
};

export function ContactForm({ text }: { text: ContactCopy }) {
  const { state, onSubmit, pending } = useFormAction<ContactState>(sendMessage, { status: 'idle' });
  const [round, setRound] = useState(0);
  const sent = state.status === 'sent' && round === 0;
  const fields = round === 0 ? state.fields ?? {} : {};

  if (sent) {
    return (
      <div className="form-wrap done">
        <div className="sent" role="status">
          <h2>{text.thanks}{state.firstName ? `, ${state.firstName}` : ''}.</h2>
          <p>{text.sentBody}</p>
          <button type="button" className="btn line" onClick={() => setRound((r) => r + 1)}>{text.another}</button>
        </div>
      </div>
    );
  }

  const invalid = (key: 'name' | 'email' | 'body') => (fields[key] ? ' invalid' : '');

  return (
    <div className="form-wrap">
      <form className="form" onSubmit={(e) => { setRound(0); onSubmit(e); }} noValidate>
        <fieldset className="field">
          <legend>{text.topic}</legend>
          <div className="pills">
            {text.topics.map((t, i) => (
              <span key={t.value}>
                <input type="radio" name="topic" id={`t-${t.value}`} value={t.value} defaultChecked={i === 0} />
                <label htmlFor={`t-${t.value}`}>{t.label}</label>
              </span>
            ))}
          </div>
        </fieldset>

        <div className="two">
          <div className={`field${invalid('name')}`}>
            <label htmlFor="f-name">{text.name}</label>
            <input id="f-name" name="name" autoComplete="name" placeholder={text.namePh} maxLength={120} required aria-invalid={!!fields.name} />
            <span className="err">{fields.name}</span>
          </div>
          <div className={`field${invalid('email')}`}>
            <label htmlFor="f-email">{text.email}</label>
            <input id="f-email" name="email" type="email" autoComplete="email" placeholder={text.emailPh} maxLength={254} required aria-invalid={!!fields.email} />
            <span className="err">{fields.email}</span>
          </div>
        </div>

        <div className="field">
          <label htmlFor="f-org">{text.org} <span className="hint">{text.optional}</span></label>
          <input id="f-org" name="organization" autoComplete="organization" maxLength={160} />
        </div>

        <div className={`field${invalid('body')}`}>
          <label htmlFor="f-msg">{text.message}</label>
          <textarea id="f-msg" name="body" rows={6} placeholder={text.messagePh} maxLength={5000} required aria-invalid={!!fields.body} />
          <span className="err">{fields.body}</span>
        </div>

        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />

        {state.error && round === 0 && <p className="alert on" role="alert">{state.error}</p>}

        <div className="form-foot">
          <p>{text.privacy}</p>
          <button className="btn solid" type="submit" disabled={pending}>
            {pending ? text.sending : text.send} <ArrowRight />
          </button>
        </div>
      </form>
    </div>
  );
}
