export default function AnimatedBackground() {
  return (
    <>
      {/* Animated Grid */}
      <div className="fixed inset-0 bg-grid" />
      
      {/* Glowing Orbs */}
      <div 
        className="fixed top-0 right-0 w-96 h-96 bg-cyan-500 rounded-full blur-[100px] opacity-30 animate-pulse"
        style={{ animationDuration: '4s' }}
      />
      <div 
        className="fixed bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-[100px] opacity-30 animate-pulse"
        style={{ animationDuration: '4s', animationDelay: '2s' }}
      />
      
      {/* Noise Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />
    </>
  );
}