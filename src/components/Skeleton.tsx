/** Placeholder layout shown by loading.tsx while a page streams in. */
export function PageSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div className="wrap" aria-busy="true" aria-label="Memuat">
      <div style={{ padding: 'clamp(48px, 7vw, 88px) 0 0' }}>
        <div className="skeleton sk-title" />
        <div className="skeleton sk-line" style={{ width: 'min(460px, 80%)' }} />
        <div className="skeleton sk-line" style={{ width: 'min(360px, 60%)' }} />
      </div>
      <div className="sk-grid">
        {Array.from({ length: cards }, (_, i) => <div key={i} className="skeleton sk-card" />)}
      </div>
    </div>
  );
}
