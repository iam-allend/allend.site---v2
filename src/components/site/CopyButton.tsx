'use client';

import { useState } from 'react';

export function CopyButton({ value, label, done }: { value: string; label: string; done: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      location.href = `mailto:${value}`;
    }
  };
  return (
    <button type="button" className="copy" onClick={copy}>
      {copied ? done : label}
    </button>
  );
}
