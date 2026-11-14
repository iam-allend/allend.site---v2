'use client';

export type ToastKind = 'ok' | 'err' | 'info';
export type ToastDetail = { message: string; kind: ToastKind };

export const TOAST_EVENT = 'admin:toast';

/** Show a short notice in the admin <Toaster>. */
export function toast(message: string, kind: ToastKind = 'ok') {
  dispatchEvent(new CustomEvent<ToastDetail>(TOAST_EVENT, { detail: { message, kind } }));
}
