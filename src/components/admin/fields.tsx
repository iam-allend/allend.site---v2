// Admin form primitives. Inputs are uncontrolled; <AdminForm> submits the FormData.

import type { I18n } from '@/lib/i18n';

type Base = { name: string; label: string; hint?: string };

export function Text({ name, label, hint, value, type = 'text', required, placeholder }: Base & {
  value?: string | number | null; type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <label className="f">
      <span>{label} {hint && <small>{hint}</small>}</span>
      <input name={name} type={type} defaultValue={value ?? ''} required={required} placeholder={placeholder} />
    </label>
  );
}

export function Area({ name, label, hint, value, rows = 4 }: Base & { value?: string | null; rows?: number }) {
  return (
    <label className="f">
      <span>{label} {hint && <small>{hint}</small>}</span>
      <textarea name={name} rows={rows} defaultValue={value ?? ''} />
    </label>
  );
}

/** Indonesian + English inputs side by side, submitted as `name.id` and `name.en`. */
export function Bilingual({ name, label, hint, value, multiline = false, rows = 3, required }: Base & {
  value?: I18n | null; multiline?: boolean; rows?: number; required?: boolean;
}) {
  const input = (lang: 'id' | 'en') =>
    multiline
      ? <textarea name={`${name}.${lang}`} rows={rows} defaultValue={value?.[lang] ?? ''} required={required && lang === 'id'} />
      : <input name={`${name}.${lang}`} defaultValue={value?.[lang] ?? ''} required={required && lang === 'id'} />;
  return (
    <div className="f">
      <span>{label} {hint && <small>{hint}</small>}</span>
      <div className="pair">
        <label data-lang="ID">{input('id')}</label>
        <label data-lang="EN">{input('en')}</label>
      </div>
    </div>
  );
}

/** List of bilingual lines: one item per line, the two columns paired by line number. */
export function BilingualList({ name, label, value, rows = 4 }: Base & { value?: I18n[]; rows?: number }) {
  return (
    <Bilingual
      name={name}
      label={label}
      hint="satu poin per baris; baris EN dipasangkan dengan baris ID"
      multiline
      rows={rows}
      value={{ id: (value ?? []).map((v) => v.id).join('\n'), en: (value ?? []).map((v) => v.en).join('\n') }}
    />
  );
}

export function Select({ name, label, value, options }: Base & { value?: string; options: { value: string; label: string }[] }) {
  return (
    <label className="f">
      <span>{label}</span>
      <select name={name} defaultValue={value}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

export function Check({ name, label, checked }: { name: string; label: string; checked?: boolean }) {
  return (
    <label className="check">
      <input type="checkbox" name={name} defaultChecked={checked} />
      {label}
    </label>
  );
}
