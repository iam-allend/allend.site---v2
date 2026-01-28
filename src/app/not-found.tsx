export default function NotFound() {
  return (

    
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center space-y-6">
        <div className="glass-strong rounded-2xl p-12 max-w-md mx-auto">
          <h1 className="text-8xl font-bold neon-text mb-4">404</h1>
          <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
          <p className="text-gray-400 mb-8">
            The page you're looking for doesn't exist.
          </p>
          <a href="/" className="inline-block bg-primary text-black font-bold px-8 py-3 rounded-lg neon-glow hover:scale-105 transition-transform">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}