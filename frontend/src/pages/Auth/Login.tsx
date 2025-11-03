/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin' : '/');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      // Navigation will be handled by the useEffect above
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.5s ease-out forwards;
        }
      `}</style>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8 animate-fade-in">
          <div className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black shadow-lg">
              <BookOpen className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold text-gray-900">ShelfNoW</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {/* Header */}
          <div className="space-y-2 text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your ShelfNoW account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700 animate-fade-in">
              {error}
            </div>
          )}

          {/* Form */}
          <div className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-900">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-2 border-gray-300 cursor-pointer accent-gray-900"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <a
                href="#"
                className="text-sm font-semibold text-gray-900 hover:text-gray-700 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed animate-slide-up shadow-lg hover:shadow-xl"
              style={{ animationDelay: '0.5s' }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-8 text-center text-sm text-gray-600 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            Don't have an account?{' '}
            <a href="/register" className="font-semibold text-gray-900 hover:text-gray-700 transition-colors">
              Create one
            </a>
          </div>
        </div>

        {/* Footer */}
        {/* <div className="mt-8 text-center text-sm text-gray-500 animate-fade-in" style={{ animationDelay: '0.7s' }}>
          © 2025 ShelfNoW. All rights reserved.
        </div> */}

      </div>
    </div>
  );
}