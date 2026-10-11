import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DEMO_ACCOUNTS = [
  {
    label: '🍽️ Restaurant',
    email: 'demo.restaurant@foodresq.com',
    password: 'Demo@1234',
    color: 'emerald',
    desc: 'List surplus food',
  },
  {
    label: '🤝 NGO',
    email: 'demo.ngo@foodresq.com',
    password: 'Demo@1234',
    color: 'blue',
    desc: 'Claim donations',
  },
  {
    label: '🙋 Volunteer',
    email: 'demo.volunteer@foodresq.com',
    password: 'Demo@1234',
    color: 'orange',
    desc: 'Help deliver food',
  },
  {
    label: '⚙️ Admin',
    email: 'demo.admin@foodresq.com',
    password: 'Demo@1234',
    color: 'purple',
    desc: 'Platform overview',
  },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(formData);
    if (result.success) {
      redirectByRole(result.user.role);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleDemoLogin = async (account) => {
    setError('');
    setDemoLoading(account.email);
    const result = await login({ email: account.email, password: account.password });
    if (result.success) {
      redirectByRole(result.user.role);
    } else {
      setError(`Demo login failed: ${result.error}. Make sure demo accounts are seeded.`);
    }
    setDemoLoading('');
  };

  const redirectByRole = (role) => {
    if (role === 'RESTAURANT') navigate('/restaurant/dashboard');
    else if (role === 'ADMIN') navigate('/admin/dashboard');
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">FoodResQ 🍱</h2>
            <p className="mt-1 text-gray-500 text-sm">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Demo Quick Login */}
          <div className="mb-6">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 text-center">
              ⚡ Try Demo — One Click Login
            </p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => handleDemoLogin(account)}
                  disabled={!!demoLoading}
                  className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all text-left
                    ${demoLoading === account.email
                      ? 'border-gray-300 bg-gray-50 opacity-60 cursor-wait'
                      : 'border-gray-200 hover:border-primary-400 hover:bg-primary-50 cursor-pointer'
                    }`}
                >
                  <span className="text-sm font-bold text-gray-800">
                    {demoLoading === account.email ? '⏳ Logging in...' : account.label}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-0.5">{account.desc}</span>
                </button>
              ))}
            </div>
            <p className="text-center text-[10px] text-gray-400 mt-2">
              Password for all demo accounts: <span className="font-mono font-bold">Demo@1234</span>
            </p>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-400 font-medium">Or sign in with your account</span>
            </div>
          </div>

          {/* Manual Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3 text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-5 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                Sign up free
              </Link>
            </p>
            <Link to="/" className="block text-xs text-gray-400 hover:text-gray-600">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
