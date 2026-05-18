import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IconLoader2 } from '@tabler/icons-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, formData);

      if (response.data.success && response.data.token) {
        // Store token in localStorage
        localStorage.setItem('authToken', response.data.token);
        // Redirect to admin
        navigate('/admin', { replace: true });
      } else {
        setError(response.data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-screen h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #c8d8ee 0%, #d8e6f5 100%)',
      }}
    >
      {/* SVG Ribbon Background */}
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
      >
        <ellipse cx="100" cy="200" rx="150" ry="80" stroke="#e050a0" strokeWidth="3" fill="none" />
        <ellipse cx="150" cy="350" rx="200" ry="100" stroke="#60b8f0" strokeWidth="3" fill="none" />
        <ellipse cx="1100" cy="150" rx="180" ry="90" stroke="#9050d0" strokeWidth="3" fill="none" />
        <ellipse cx="1050" cy="650" rx="220" ry="110" stroke="#40c8b8" strokeWidth="3" fill="none" />
      </svg>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '32px',
          borderRadius: '16px',
          background: 'rgba(230, 242, 255, 0.75)',
          backdropFilter: 'blur(20px)',
          border: '0.5px solid rgba(255, 255, 255, 0.9)',
          boxShadow: '0 8px 32px rgba(26, 56, 112, 0.1)',
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="font-bold mb-2"
            style={{
              fontSize: '28px',
              color: '#1a3870',
            }}
          >
            Admin Access
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: '#6b92b8',
            }}
          >
            Sign in to manage your portfolio
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label
              className="text-xs font-semibold block mb-2"
              style={{
                color: '#6b92b8',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="admin@example.com"
              required
              className="w-full px-4 py-2.5 rounded-lg text-sm transition-all focus:outline-none"
              style={{
                background: 'rgba(255, 255, 255, 0.6)',
                border: '0.5px solid rgba(255, 255, 255, 0.8)',
                color: '#1a3870',
              }}
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              className="text-xs font-semibold block mb-2"
              style={{
                color: '#6b92b8',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 rounded-lg text-sm transition-all focus:outline-none"
              style={{
                background: 'rgba(255, 255, 255, 0.6)',
                border: '0.5px solid rgba(255, 255, 255, 0.8)',
                color: '#1a3870',
              }}
            />
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg text-xs text-center"
              style={{
                background: 'rgba(240, 80, 160, 0.15)',
                color: '#e050a0',
              }}
            >
              {error}
            </motion.div>
          )}

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50 mt-6"
            style={{
              background: loading ? 'rgba(26, 110, 245, 0.5)' : 'linear-gradient(135deg, #1a6ef5 0%, #1a3870 100%)',
              color: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <IconLoader2 size={14} className="animate-spin" />
                Signing In...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer */}
        <p
          className="text-center text-xs mt-6"
          style={{
            color: '#6b92b8',
          }}
        >
          Secure admin access for portfolio management
        </p>
      </motion.div>
    </div>
  );
}
