export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Memuat">
      <div className="skeleton" style={{ height: 34, width: 220 }} />
      <div className="skeleton sk-line" style={{ width: 320 }} />
      <div className="adm-cards" style={{ marginTop: 28 }}>
        {Array.from({ length: 6 }, (_, i) => <div key={i} className="skeleton" style={{ aspectRatio: '4 / 3.4' }} />)}
      </div>
    </div>
  );
}
