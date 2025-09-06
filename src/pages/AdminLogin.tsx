import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Stethoscope, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('Admin login attempt with password:', password);

    // Simple password check
    if (password === 'Davis') {
      console.log('Password correct, setting admin session');
      // Store admin session in localStorage
      localStorage.setItem('medfly_admin', 'true');
      
      // Also create a simple Supabase session for consistency
      try {
        // Sign in with a dummy email for admin
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: 'admin@medfly.com',
          password: 'admin123'
        });
        
        if (signInError) {
          console.log('Admin auth not set up in Supabase, continuing with localStorage only');
        }
      } catch (err) {
        console.log('Supabase auth error (expected):', err);
      }
      
      console.log('Navigating to admin dashboard');
      navigate('/admin');
    } else {
      console.log('Incorrect password');
      setError('Incorrect password. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
            <Stethoscope size={40} className="text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Medfly Admin</h1>
          <p className="text-blue-100 text-lg">Medical Notes Platform</p>
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-blue-100 text-sm">
            <Lock className="w-4 h-4 mr-2" />
            Secure Admin Access
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Access</h2>
            <p className="text-gray-600">Enter your password to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-3 flex-shrink-0"></div>
                {error}
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-3">
                Admin Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-4 pl-12 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="Enter admin password"
                  autoFocus
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Verifying...
                </div>
              ) : (
                'Access Admin Dashboard'
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Lock className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-1">Secure Access</h4>
                <p className="text-xs text-blue-700 leading-relaxed">
                  This admin panel allows you to manage medical notes, units, lecturers, and platform content. 
                  Access is restricted to authorized personnel only.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-blue-200 text-sm">
            © 2024 Medfly Medical Platform. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;