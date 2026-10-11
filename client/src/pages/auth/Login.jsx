import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const QUICK_ROLES = [
  {
    role: 'RESTAURANT',
    label: '🍽️ Restaurant',
    subtitle: 'Post surplus food & AI shelf life',
    accent: 'border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50/70',
    badge: 'bg-emerald-100 text-emerald-800',
  },
  {
    role: 'NGO',
    label: '🤝 NGO & Charity',
    subtitle: 'Claim food donations & route maps',
    accent: 'border-blue-300 hover:border-blue-500 hover:bg-blue-50/70',
    badge: 'bg-blue-100 text-blue-800',
  },
  {
    role: 'VOLUNTEER',
    label: '🙋 Volunteer',
    subtitle: 'Delivery missions & food badges',
    accent: 'border-amber-300 hover:border-amber-500 hover:bg-amber-50/70',
    badge: 'bg-amber-100 text-amber-800',
  },
  {
    role: 'ADMIN',
    label: '⚙️ Platform Admin',
    subtitle: 'Live Tamil Nadu map & analytics',
    accent: 'border-purple-300 hover:border-purple-500 hover:bg-purple-50/70',
    badge: 'bg-purple-100 text-purple-800',
  },
];

export default function Login() {
  const navigate = useNavigate();
  const { login, instantLogin } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState('');

  const redirectByRole = (role) => {
    if (role === 'RESTAURANT') navigate('/restaurant/dashboard');
    else if (role === 'ADMIN') navigate('/admin/dashboard');
    else navigate('/dashboard');
  };

  const handleInstantAccess = (role) => {
    setActiveRole(role);
    const result = instantLogin(role);
    if (result.success) {
      redirectByRole(result.user.role);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Any email and password will succeed thanks to resilient login
    const result = await login(formData);
    if (result.success) {
      redirectByRole(result.user.role);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-5">

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 p-7 sm:p-8">
          <div className="text-center mb-6">
            <span className="inline-block p-3 bg-emerald-100 rounded-2xl text-3xl mb-2">🍱</span>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">FoodResQ</h2>
            <p className="mt-1 text-sm text-gray-600">Smart Food Rescue & AI Distribution Platform</p>
          </div>

          {/* Instant 1-Click Access Section */}
          <div className="mb-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                ⚡ Instant 1-Click Access
              </span>
              <span className="text-[11px] bg-emerald-200 text-emerald-900 font-semibold px-2 py-0.5 rounded-full">
                No Password Needed
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {QUICK_ROLES.map((item) => (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => handleInstantAccess(item.role)}
                  className={`flex flex-col items-start p-3 bg-white rounded-xl border-2 transition-all shadow-sm active:scale-95 text-left ${item.accent} ${
                    activeRole === item.role ? 'ring-2 ring-emerald-500' : ''
                  }`}
                >
                  <span className="text-sm font-bold text-gray-900 flex items-center gap-1">
                    {item.label}
                  </span>
                  <span className="text-[10.5px] text-gray-500 mt-0.5 line-clamp-1">
                    {item.subtitle}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-center text-[11px] text-emerald-700 mt-2 font-medium">
              👉 Tap any role above to enter the platform instantly!
            </p>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-400 font-semibold uppercase tracking-wider">
                Or Sign In With Any Details
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="text"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all"
                placeholder="any-email@domain.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all"
                placeholder="Any password works"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-[11.5px] text-amber-800 flex items-center gap-2">
              <span>🔓</span>
              <span><strong>Open Public Access:</strong> Any email and password works instantly!</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all text-sm disabled:opacity-50"
            >
              {loading ? 'Entering FoodResQ...' : 'Sign In Now →'}
            </button>
          </form>

          {/* Footer links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-xs text-gray-600">
              Want a custom profile?{' '}
              <Link to="/register" className="font-bold text-emerald-600 hover:text-emerald-700 underline">
                Create Account (Easy)
              </Link>
            </p>
            <Link to="/" className="inline-block text-xs text-gray-400 hover:text-gray-600">
              ← Back to FoodResQ Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
