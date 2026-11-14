'use client';

import { useEffect, useRef, useTransition } from 'react';
import type { FormState } from '@/lib/forms';
import { toast } from '@/lib/toast';
import { useFormAction } from '@/lib/use-form-action';

/**
 * Wraps an admin server action. Keeps typed values on validation errors, marks the
 * invalid inputs, locks the fields while saving and reports the result as a toast.
 */
export function AdminForm({ action, submit, children, initial, compact = false }: {
  action: (state: FormState, form: FormData) => Promise<FormState>;
  submit: string;
  children: React.ReactNode;
  initial?: FormState;
  compact?: boolean;
}) {
  const { state, onSubmit, pending } = useFormAction(action, initial ?? {});
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) toast(state.ok);
    else if (state.error) toast(state.error, 'err');

    const el = form.current;
    if (!el) return;
    el.querySelectorAll('[aria-invalid]').forEach((n) => n.removeAttribute('aria-invalid'));
    let first: HTMLElement | null = null;
    for (const name of state.invalid ?? []) {
      el.querySelectorAll<HTMLElement>(`[name="${name}"], [name^="${name}."]`).forEach((n) => {
        n.setAttribute('aria-invalid', 'true');
        first ??= n;
      });
    }
    (first as HTMLElement | null)?.focus();
  }, [state]);

  return (
    <form ref={form} className={`adm-form${compact ? ' compact' : ''}`} onSubmit={onSubmit} aria-busy={pending}>
      {state.error && <p className="notice err" role="alert">{state.error}</p>}
      <fieldset className="adm-fields" disabled={pending}>{children}</fieldset>
      <div className="adm-actions">
        <button className="btn solid" type="submit" disabled={pending}>
          {pending && <span className="spin sm" aria-hidden="true" />}
          {pending ? 'Menyimpan…' : submit}
        </button>
      </div>
    </form>
  );
}

/**
 * One-click action (delete, archive…). Asks first when `confirm` is set, shows a
 * spinner, dims the surrounding `[data-row]` while it runs and toasts `done`.
 */
export function ActionButton({ action, label, confirm, done, icon, className = 'btn sm ghost' }: {
  action: () => Promise<void>;
  label: string;
  confirm?: string;
  done?: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  const [pending, start] = useTransition();
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={ref}
      type="button"
      className={className}
      disabled={pending}
      aria-label={icon ? label : undefined}
      title={icon ? label : undefined}
      onClick={() => {
        if (confirm && !window.confirm(confirm)) return;
        const row = ref.current?.closest('[data-row]');
        row?.classList.add('is-busy');
        start(async () => {
          try {
            await action();
            if (done) toast(done);
          } catch (err) {
            // redirect() inside an action is a navigation signal, not a failure.
            if (String((err as { digest?: string })?.digest).startsWith('NEXT_REDIRECT')) throw err;
            toast('Gagal memproses. Coba lagi.', 'err');
          } finally {
            row?.classList.remove('is-busy');
          }
        });
      }}
    >
      {pending ? <span className="spin sm" aria-hidden="true" /> : icon}
      {!icon && label}
    </button>
  );
}

/** Two-column settings block: title and help text on the left, fields on the right. */
export function FormSection({ title, help, children }: { title: string; help?: string; children: React.ReactNode }) {
  return (
    <section className="form-section">
      <header>
        <h2>{title}</h2>
        {help && <p>{help}</p>}
      </header>
      <div className="form-section-body">{children}</div>
    </section>
  );
}
