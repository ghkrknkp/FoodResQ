import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'RESTAURANT') return '/restaurant/dashboard';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    return '/dashboard';
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">FoodResQ</span>
            </Link>
            
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link to="/browse" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">
                Browse Food
              </Link>
              {isAuthenticated && user.role === 'RESTAURANT' && (
                <Link to="/restaurant/listings" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">
                  My Listings
                </Link>
              )}
              {isAuthenticated && (user.role === 'NGO' || user.role === 'VOLUNTEER') && (
                <Link to="/claims" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">
                  My Claims
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="hidden md:flex md:items-center md:space-x-4">
                <Link to="/notifications" className="text-gray-700 hover:text-primary-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </Link>
                <Link to={getDashboardLink()} className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">{user.name}</span>
                  <span className="badge badge-info">{user.role}</span>
                </div>
                <button onClick={handleLogout} className="btn btn-outline text-sm">
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex md:items-center md:space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary text-sm">
                  Sign Up
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/browse" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              Browse Food
            </Link>
            {isAuthenticated ? (
              <>
                <Link to={getDashboardLink()} className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                  Dashboard
                </Link>
                {user.role === 'RESTAURANT' && (
                  <Link to="/restaurant/listings" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                    My Listings
                  </Link>
                )}
                {(user.role === 'NGO' || user.role === 'VOLUNTEER') && (
                  <Link to="/claims" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                    My Claims
                  </Link>
                )}
                <Link to="/notifications" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                  Notifications
                </Link>
                <div className="px-3 py-2 text-sm text-gray-600">
                  {user.name} ({user.role})
                </div>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                  Login
                </Link>
                <Link to="/register" className="block px-3 py-2 text-primary-600 hover:bg-gray-100 rounded-md font-medium">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
