'use client';

import { startTransition, useActionState, type FormEvent } from 'react';

/**
 * useActionState without React's automatic form reset: the form is submitted from
 * onSubmit, so a failed validation keeps what the visitor typed.
 * `pending` is useActionState's own flag, so it clears as soon as the action settles
 * (a separate useTransition could stay pending across the revalidation refresh).
 */
export function useFormAction<S extends object>(action: (state: S, form: FormData) => Promise<S>, initial: S) {
  // State objects are plain (never thenables), so Awaited<S> is S.
  const [state, run, pending] = useActionState<S, FormData>(
    action as (state: Awaited<S>, form: FormData) => Promise<S>,
    initial as Awaited<S>,
  );

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => run(data));
  };

  return { state: state as S, onSubmit, pending };
}
