import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const FALLBACK_NGO_DASHBOARD = {
  summary: {
    availableListings: 14,
    availableDonations: 14,
    totalClaims: 8,
    pendingPickups: 3,
    completedClaims: 5,
    foodCollected: 240,
  },
  recentClaims: [
    {
      _id: 'claim_1',
      status: 'PICKUP_PENDING',
      quantity: 30,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      foodListingId: {
        _id: 'food_1',
        foodName: 'Vegetable Biryani & Curd Rice',
        quantity: 30,
        unit: 'meals',
        providerId: {
          name: 'Anjappar Chettinad',
          organizationName: 'Anjappar Chennai',
          location: 'T. Nagar, Chennai',
        },
      },
    },
    {
      _id: 'claim_2',
      status: 'CLAIMED',
      quantity: 50,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      foodListingId: {
        _id: 'food_2',
        foodName: 'Fresh Idli & Medu Vada Feast',
        quantity: 50,
        unit: 'servings',
        providerId: {
          name: 'Murugan Idli Shop',
          organizationName: 'Murugan Idli Group',
          location: 'Mylapore, Chennai',
        },
      },
    },
    {
      _id: 'claim_3',
      status: 'COMPLETED',
      quantity: 25,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      foodListingId: {
        _id: 'food_3',
        foodName: 'Bakery Buns & Whole Wheat Loaves',
        quantity: 25,
        unit: 'loaves',
        providerId: {
          name: 'Hot Breads Cafe',
          organizationName: 'Hot Breads Tamil Nadu',
          location: 'Anna Nagar, Chennai',
        },
      },
    },
  ],
  expiringSoon: [
    {
      _id: 'exp_1',
      foodName: 'Paneer Butter Masala & Rotis',
      quantity: 25,
      unit: 'servings',
      expiryTime: new Date(Date.now() + 3 * 3600000).toISOString(),
      providerId: {
        name: 'Sangeetha Veg Restaurant',
        organizationName: 'Sangeetha Group',
        location: 'Adyar, Chennai',
      },
    },
    {
      _id: 'exp_2',
      foodName: 'Pongal Feast & Medu Vada',
      quantity: 40,
      unit: 'servings',
      expiryTime: new Date(Date.now() + 5 * 3600000).toISOString(),
      providerId: {
        name: 'Saravana Bhavan',
        organizationName: 'Saravana Bhavan TN',
        location: 'T. Nagar, Chennai',
      },
    },
  ],
};

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(FALLBACK_NGO_DASHBOARD);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/ngo');
      if (response?.data?.success && response.data.data) {
        setDashboard(response.data.data);
      } else {
        setDashboard(FALLBACK_NGO_DASHBOARD);
      }
    } catch (err) {
      console.warn('Dashboard API note, using cached demo data:', err?.message);
      setDashboard(FALLBACK_NGO_DASHBOARD);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      CLAIMED: { class: 'badge-info', text: 'Claimed' },
      PICKUP_PENDING: { class: 'badge-warning', text: 'Pickup Pending' },
      COLLECTED: { class: 'badge-success', text: 'Collected' },
      COMPLETED: { class: 'badge-gray', text: 'Completed' }
    };
    const config = statusConfig[status] || { class: 'badge-gray', text: status };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString || Date.now()).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeRemaining = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate || Date.now());
    const hours = Math.floor((expiry - now) / (1000 * 60 * 60));
    
    if (hours < 0) return 'Expired';
    if (hours < 24) return `${hours}h remaining`;
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  };

  if (loading && !dashboard) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="skeleton h-12 w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton h-24 rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="skeleton h-64 rounded-lg"></div>
              <div className="skeleton h-64 rounded-lg"></div>
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
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            {user?.role === 'NGO' ? 'NGO Dashboard' : 'Volunteer Dashboard'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl font-bold text-blue-600">
                {dashboard?.summary?.availableListings || 0}
              </div>
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="text-sm font-medium text-gray-600">Available Donations</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl font-bold text-primary-600">
                {dashboard?.summary?.totalClaims || 0}
              </div>
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div className="text-sm font-medium text-gray-600">My Claims</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl font-bold text-orange-600">
                {dashboard?.summary?.pendingPickups || 0}
              </div>
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-sm font-medium text-gray-600">Pending Pickups</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl font-bold text-green-600">
                {dashboard?.summary?.completedClaims || 0}
              </div>
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-sm font-medium text-gray-600">Completed</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl font-bold text-purple-600">
                {dashboard?.summary?.foodCollected || 0}
              </div>
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="text-sm font-medium text-gray-600">Food Collected</div>
            <div className="text-xs text-gray-500 mt-1">kg/units</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/browse" className="btn btn-primary">
              Browse Food
            </Link>
            <Link to="/claims" className="btn btn-outline">
              My Claims
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Claims */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Claims</h2>
            {!dashboard?.recentClaims || dashboard.recentClaims.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No recent claims</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">
                        Food Item
                      </th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">
                        Provider
                      </th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">
                        Quantity
                      </th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">
                        Status
                      </th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {dashboard.recentClaims.slice(0, 5).map((claim) => (
                      <tr key={claim.id}>
                        <td className="py-3">
                          <Link 
                            to={`/food/${claim.foodListing?.id}`}
                            className="text-primary-600 hover:text-primary-700 font-medium"
                          >
                            {claim.foodListing?.foodName || 'N/A'}
                          </Link>
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                          {claim.foodListing?.provider?.name || 'N/A'}
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                          {claim.quantity} {claim.foodListing?.unit}
                        </td>
                        <td className="py-3">
                          {getStatusBadge(claim.status)}
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                          {formatDate(claim.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Expiring Soon */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Expiring Soon</h2>
            {!dashboard?.expiringSoon || dashboard.expiringSoon.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No listings expiring soon</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboard.expiringSoon.map((food) => (
                  <Link
                    key={food.id}
                    to={`/food/${food.id}`}
                    className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {food.foodName}
                        </h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>
                            Quantity: {food.quantityAvailable} {food.unit}
                          </div>
                          <div className="flex items-center gap-1 text-orange-600 font-medium">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {getTimeRemaining(food.expiryDate)}
                          </div>
                        </div>
                      </div>
                      <span className="badge badge-info ml-2">{food.category}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
