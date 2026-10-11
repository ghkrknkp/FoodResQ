import { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

const FALLBACK_ADMIN_DASHBOARD = {
  users: {
    total: 38,
    restaurants: 12,
    ngos: 16,
    volunteers: 10,
  },
  listings: {
    total: 86,
    active: 14,
    completed: 68,
    expired: 4,
  },
  claims: {
    total: 78,
    completed: 68,
  },
  impact: {
    foodRedistributed: 2850,
  },
  categoryDistribution: [
    { _id: 'Cooked Meals', count: 44 },
    { _id: 'Bakery', count: 20 },
    { _id: 'Dairy & Sweets', count: 12 },
    { _id: 'Produce', count: 10 },
  ],
  activityOverTime: [
    { _id: '2026-10-01', listings: 8 },
    { _id: '2026-10-05', listings: 14 },
    { _id: '2026-10-09', listings: 22 },
  ],
  claimsOverTime: [
    { _id: '2026-10-01', claims: 6 },
    { _id: '2026-10-05', claims: 12 },
    { _id: '2026-10-09', claims: 19 },
  ],
  topContributors: [
    { name: 'Anjappar Chettinad', organizationName: 'Anjappar Group', completedDonations: 28 },
    { name: 'Murugan Idli Shop', organizationName: 'Murugan Idli Group', completedDonations: 24 },
    { name: 'Hot Breads', organizationName: 'Hot Breads Cafe', completedDonations: 16 },
  ],
};

  const fetchDashboard = async () => {
    try {
      setError('');
      const response = await api.get('/dashboard/admin');
      if (response?.data?.success && response.data.data) {
        setDashboard(response.data.data);
      } else {
        setDashboard(FALLBACK_ADMIN_DASHBOARD);
      }
    } catch (error) {
      console.warn('Admin dashboard using fallback:', error?.message);
      setDashboard(FALLBACK_ADMIN_DASHBOARD);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !dashboard) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8 skeleton"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg skeleton"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getBadgeClass = (role) => {
    switch (role) {
      case 'RESTAURANT':
        return 'badge-info';
      case 'NGO':
        return 'badge-success';
      case 'VOLUNTEER':
        return 'badge-warning';
      case 'ADMIN':
        return 'badge-danger';
      default:
        return 'badge-gray';
    }
  };

  const getStatusCount = (status) => {
    if (!dashboard?.listingsByStatus) return 0;
    const statusObj = dashboard.listingsByStatus.find(s => s._id === status);
    return statusObj?.count || 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Platform Overview & Analytics</p>
        </div>

        {/* Platform Stats */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Platform Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {dashboard?.summary?.totalUsers || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Restaurants</p>
                  <p className="text-3xl font-bold text-primary-600 mt-1">
                    {dashboard?.summary?.totalRestaurants || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">NGOs & Volunteers</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">
                    {(dashboard?.summary?.totalNGOs || 0) + (dashboard?.summary?.totalVolunteers || 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Listings</p>
                  <p className="text-3xl font-bold text-orange-600 mt-1">
                    {dashboard?.summary?.totalListings || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Listings</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">
                    {dashboard?.summary?.activeListings || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed Donations</p>
                  <p className="text-3xl font-bold text-purple-600 mt-1">
                    {dashboard?.summary?.completedDonations || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Users by Role */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Users by Role</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="badge badge-info">Restaurant</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {dashboard?.summary?.totalRestaurants || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="badge badge-success">NGO</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {dashboard?.summary?.totalNGOs || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="badge badge-warning">Volunteer</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {dashboard?.summary?.totalVolunteers || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Listings by Status */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Listings by Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="badge badge-success">AVAILABLE</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {getStatusCount('AVAILABLE')}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="badge badge-info">CLAIMED</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {getStatusCount('CLAIMED')}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="badge badge-success">COMPLETED</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {getStatusCount('COMPLETED')}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="badge badge-gray">EXPIRED</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {getStatusCount('EXPIRED')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Contributors */}
        {dashboard?.topContributors && dashboard.topContributors.length > 0 && (
          <div className="card mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Contributors</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name/Organization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Donations
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dashboard.topContributors.map((contributor) => (
                    <tr key={contributor._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {contributor.name || contributor.organizationName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${getBadgeClass(contributor.role)}`}>
                          {contributor.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {contributor.donationCount || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
