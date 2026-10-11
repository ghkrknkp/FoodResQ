import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register, instantLogin } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'NGO',
    organizationName: '',
    phone: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const redirectByRole = (role) => {
    if (role === 'RESTAURANT') navigate('/restaurant/dashboard');
    else if (role === 'ADMIN') navigate('/admin/dashboard');
    else navigate('/dashboard');
  };

  const handleQuickEnter = (role) => {
    const result = instantLogin(role);
    if (result.success) {
      redirectByRole(result.user.role);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);

    if (result.success) {
      redirectByRole(result.user.role);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 p-7 sm:p-9">
          <div className="text-center mb-6">
            <span className="inline-block p-3 bg-emerald-100 rounded-2xl text-3xl mb-2">🌱</span>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Join FoodResQ</h2>
            <p className="mt-1 text-sm text-gray-600">Free open registration — start rescuing food immediately</p>
          </div>

          {/* Instant Shortcut */}
          <div className="mb-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
            <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
              ⚡ Want to explore first without registering?
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickEnter('RESTAURANT')}
                className="py-2 px-3 bg-white hover:bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-bold text-gray-800 shadow-sm transition-all"
              >
                🍽️ Restaurant
              </button>
              <button
                type="button"
                onClick={() => handleQuickEnter('NGO')}
                className="py-2 px-3 bg-white hover:bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-bold text-gray-800 shadow-sm transition-all"
              >
                🤝 NGO
              </button>
              <button
                type="button"
                onClick={() => handleQuickEnter('VOLUNTEER')}
                className="py-2 px-3 bg-white hover:bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-bold text-gray-800 shadow-sm transition-all"
              >
                🙋 Volunteer
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your Name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="your-email@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Password *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Any password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Your Role *
                </label>
                <select
                  id="role"
                  name="role"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-sm transition-all bg-white"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="RESTAURANT">🍽️ Restaurant / Food Provider</option>
                  <option value="NGO">🤝 NGO / Food Bank</option>
                  <option value="VOLUNTEER">🙋 Volunteer Driver</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="organizationName" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Organization / Location (Optional)
                </label>
                <input
                  id="organizationName"
                  name="organizationName"
                  type="text"
                  placeholder="e.g. Annapoorna Trust, Chennai"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
                  value={formData.organizationName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 flex items-center gap-2">
              <span>✨</span>
              <span><strong>Instant Activation:</strong> Your account is activated instantly with 0 waiting time.</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all text-sm disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Complete Free Registration →'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-xs text-gray-600">
              Already have an account or want demo access?{' '}
              <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-700 underline">
                Sign in here
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
