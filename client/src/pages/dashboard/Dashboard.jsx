import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/dashboard/ngo');
      if (response.data.success) {
        setDashboard(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            {user.role === 'NGO' ? 'NGO Dashboard' : 'Volunteer Dashboard'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available Donations</p>
                <p className="text-3xl font-bold text-primary-600 mt-1">
                  {dashboard?.summary.availableDonations || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">My Claims</p>
                <p className="text-3xl font-bold text-secondary-600 mt-1">
                  {dashboard?.summary.totalClaims || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Pickups</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">
                  {dashboard?.summary.pendingPickups || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {dashboard?.summary.completedClaims || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/browse" className="btn btn-primary">
              Browse Available Food
            </Link>
            <Link to="/claims" className="btn btn-outline">
              View My Claims
            </Link>
            <Link to="/notifications" className="btn btn-outline">
              Notifications
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Claims */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Claims</h2>
            {dashboard?.recentClaims && dashboard.recentClaims.length > 0 ? (
              <div className="space-y-4">
                {dashboard.recentClaims.slice(0, 5).map((claim) => (
                  <div key={claim._id} className="border-l-4 border-primary-500 pl-4 py-2">
                    <p className="font-medium text-gray-900">
                      {claim.foodListingId?.foodName || 'Food Item'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {claim.quantity} {claim.foodListingId?.unit} - {claim.status}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(claim.claimedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No claims yet</p>
            )}
          </div>

          {/* Expiring Soon */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Expiring Soon</h2>
            {dashboard?.expiringSoon && dashboard.expiringSoon.length > 0 ? (
              <div className="space-y-4">
                {dashboard.expiringSoon.map((listing) => (
                  <Link
                    key={listing._id}
                    to={`/food/${listing._id}`}
                    className="block border-l-4 border-red-500 pl-4 py-2 hover:bg-gray-50 transition-colors"
                  >
                    <p className="font-medium text-gray-900">{listing.foodName}</p>
                    <p className="text-sm text-gray-600">
                      {listing.remainingQuantity} {listing.unit} - {listing.pickupLocation}
                    </p>
                    <p className="text-xs text-red-600">
                      Expires: {new Date(listing.expiryTime).toLocaleString()}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No food expiring soon</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
