// Loading placeholders shown by loading.tsx while a page streams in.
// They mirror the real layouts so content lands where the eye already is.

const Line = ({ w, h }: { w: string; h?: number }) => <div className="skeleton sk-line" style={{ width: w, height: h }} />;

export function PageSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div className="wrap" aria-busy="true" aria-label="Memuat">
      <div style={{ padding: 'clamp(48px, 7vw, 88px) 0 0' }}>
        <div className="skeleton sk-title" />
        <Line w="min(460px, 80%)" />
        <Line w="min(360px, 60%)" />
      </div>
      <div className="sk-grid">
        {Array.from({ length: cards }, (_, i) => <div key={i} className="skeleton sk-card" />)}
      </div>
    </div>
  );
}

/** Work page: title, card grid on the left, category list on the right. */
export function WorkSkeleton() {
  return (
    <div className="wrap" aria-busy="true" aria-label="Memuat">
      <div className="page-head">
        <div className="skeleton sk-title" />
        <Line w="min(520px, 85%)" />
      </div>
      <div className="work-layout">
        <div className="grid-work">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="sk-wcard">
              <div className="skeleton sk-media" />
              <Line w="40%" />
              <Line w="70%" h={22} />
              <Line w="90%" />
            </div>
          ))}
        </div>
        <div className="cat-nav">
          {Array.from({ length: 5 }, (_, i) => <Line key={i} w="100%" h={38} />)}
        </div>
      </div>
    </div>
  );
}

/** Project detail: title + facts, the viewer stage and its thumbnail rail. */
export function DetailSkeleton() {
  return (
    <div className="wrap" aria-busy="true" aria-label="Memuat">
      <div className="case-head">
        <div className="case-title">
          <Line w="120px" />
          <div className="skeleton sk-title" style={{ marginTop: 14 }} />
          <Line w="min(420px, 80%)" />
          <div style={{ display: 'flex', gap: 8, marginTop: 26 }}>
            <div className="skeleton" style={{ width: 150, height: 44 }} />
            <div className="skeleton" style={{ width: 110, height: 44 }} />
          </div>
        </div>
        <div className="case-facts">
          {Array.from({ length: 4 }, (_, i) => <Line key={i} w="100%" h={22} />)}
        </div>
      </div>
      <div className="viewer">
        <div className="skeleton sk-stage" />
        <div className="rail-wrap sk-rail">
          {Array.from({ length: 4 }, (_, i) => <div key={i} className="skeleton sk-thumb" />)}
        </div>
      </div>
    </div>
  );
}
