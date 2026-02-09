'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import AnimatedBackground from '@/components/shared/AnimatedBackground';
import CustomCursor from '@/components/shared/CustomCursor';

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError('');
  };

  return (
    <>
      <CustomCursor />
      <AnimatedBackground />

      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <h1 className="text-3xl font-bold neon-text">
                ALLEND<span className="text-primary">.</span>
              </h1>
            </Link>
            <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
            <p className="text-gray-400">Sign in to access admin panel</p>
          </div>

          {/* Login Form */}
          <div className="glass-strong rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="glass border border-red-500/50 rounded-lg p-4">
                  <p className="text-red-400 text-sm">⚠️ {error}</p>
                </div>
              )}

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email"
                className="w-full px-4 py-3 glass rounded-lg"
              />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password"
                className="w-full px-4 py-3 glass rounded-lg"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary text-black rounded-lg"
              >
                {isLoading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          </div>

          <div className="text-center mt-6">
            <Link href="/" className="text-sm text-gray-400">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}