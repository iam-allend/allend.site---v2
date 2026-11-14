// Static SVG illustrations for the capability cards.

type Column = [name: string, type: string, key?: boolean];

function Table({ x, y, name, columns }: { x: number; y: number; name: string; columns: Column[] }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect className="t-box" width="128" height={24 + columns.length * 20} rx="6" />
      <path className="t-head" d="M0 6a6 6 0 0 1 6-6h116a6 6 0 0 1 6 6v18H0z" />
      <text className="t-name" x="10" y="16">{name}</text>
      {columns.map(([col, type, key], i) => (
        <g key={col}>
          <text className={key ? 't-key' : 't-col'} x="10" y={38 + i * 20}>{col}</text>
          <text className="t-type" x="118" y={38 + i * 20} textAnchor="end">{type}</text>
        </g>
      ))}
    </g>
  );
}

export function ErdIllustration() {
  return (
    <svg className="erd" viewBox="0 0 460 172" aria-hidden="true">
      <path className="t-link" d="M136 86H150V46H166M150 86V112H324" />
      <path className="t-link" d="M141 81v10M158 46l8-6M158 46l8 6M316 112l8-6M316 112l8 6" />
      <Table x={8} y={52} name="employees" columns={[['id', 'PK', true], ['name', 'text'], ['division_id', 'FK']]} />
      <Table x={166} y={12} name="attendances" columns={[['employee_id', 'FK', true], ['check_in', 'time'], ['status', 'enum']]} />
      <Table x={324} y={78} name="payrolls" columns={[['employee_id', 'FK', true], ['period', 'date'], ['net_pay', 'num']]} />
    </svg>
  );
}

export function PenIllustration() {
  return (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 62C22 18 58 18 68 62" />
      <rect x="8" y="58" width="8" height="8" fill="var(--paper)" />
      <rect x="64" y="58" width="8" height="8" fill="var(--paper)" />
      <path d="M40 30 26 14M40 30 54 14" strokeDasharray="2 3" />
      <circle cx="26" cy="14" r="3.5" fill="var(--accent)" stroke="none" />
      <circle cx="54" cy="14" r="3.5" fill="var(--accent)" stroke="none" />
    </svg>
  );
}

export function RouterIllustration() {
  return (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <rect x="10" y="44" width="60" height="20" rx="4" />
      <path d="M22 44V24M58 44V24" />
      <circle cx="22" cy="54" r="2.5" fill="var(--accent)" stroke="none" />
      <circle cx="31" cy="54" r="2.5" fill="currentColor" stroke="none" />
      <path d="M44 54h16" />
      <path d="M31 17a13 13 0 0 1 18 0M35 22a7 7 0 0 1 10 0" />
    </svg>
  );
}
