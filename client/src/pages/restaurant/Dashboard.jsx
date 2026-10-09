import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import api from '../../services/api';
import DemandInsights from '../../components/ai/DemandInsights';
import AnalyticsCharts from '../../components/analytics/AnalyticsCharts';

export default function Dashboard() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Listen for new claims in real-time and refresh dashboard data
  useEffect(() => {
    if (!socket) return;

    const handleClaimCreated = () => {
      fetchDashboard();
    };

    socket.on('claim:created', handleClaimCreated);

    return () => {
      socket.off('claim:created', handleClaimCreated);
    };
  }, [socket]);

  const fetchDashboard = async () => {
    try {
      setError('');
      const response = await api.get('/dashboard/restaurant');
      if (response.data.success) {
        setDashboard(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setError(error.response?.data?.message || 'Failed to load dashboard data');
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
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8 skeleton"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg skeleton"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="card bg-red-50 border border-red-200">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const getBadgeClass = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'badge-success';
      case 'CLAIMED':
        return 'badge-info';
      case 'COMPLETED':
        return 'badge-success';
      case 'EXPIRED':
        return 'badge-gray';
      default:
        return 'badge-gray';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600 mt-2">Restaurant Dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <div className="card">
            <p className="text-sm text-gray-600">Total Listings</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {dashboard?.summary?.totalListings || 0}
            </p>
          </div>

          <div className="card">
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {dashboard?.summary?.activeListings || 0}
            </p>
          </div>

          <div className="card">
            <p className="text-sm text-gray-600">Claimed</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {dashboard?.summary?.claimedListings || 0}
            </p>
          </div>

          <div className="card">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {dashboard?.summary?.completedListings || 0}
            </p>
          </div>

          <div className="card">
            <p className="text-sm text-gray-600">Expired</p>
            <p className="text-2xl font-bold text-gray-600 mt-1">
              {dashboard?.summary?.expiredListings || 0}
            </p>
          </div>

          <div className="card">
            <p className="text-sm text-gray-600">Food Redistributed</p>
            <p className="text-2xl font-bold text-primary-600 mt-1">
              {dashboard?.summary?.totalFoodRedistributed || 0}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex gap-4">
            <Link to="/restaurant/listings/create" className="btn btn-primary">
              + Create New Listing
            </Link>
            <Link to="/restaurant/listings" className="btn btn-outline">
              View All Listings
            </Link>
          </div>
        </div>

        {/* AI Demand Insights */}
        <DemandInsights />

        {/* Analytics Charts */}
        {(() => {
          // categoryDistribution arrives as { CATEGORY: count } — convert to array
          const categoryData = Object.entries(dashboard?.categoryDistribution || {}).map(
            ([category, count]) => ({ category, count })
          );

          // listingsOverTime is [{ _id: 'YYYY-MM-DD', count }] — normalise key to `date`
          const claimsOverTime = (dashboard?.listingsOverTime || []).map((item) => ({
            date: item._id,
            count: item.count,
          }));

          // Build status distribution from summary counts
          const summary = dashboard?.summary || {};
          const statusDistribution = [
            { name: 'Available', value: summary.activeListings || 0 },
            { name: 'Claimed', value: summary.claimedListings || 0 },
            { name: 'Completed', value: summary.completedListings || 0 },
            { name: 'Expired', value: summary.expiredListings || 0 },
          ];

          // Impact metrics derived from food redistributed
          const totalQuantity = summary.totalFoodRedistributed || summary.foodRedistributed || 0;
          const impactMetrics = {
            totalQuantity,
            co2Saved: totalQuantity * 0.5,
            mealsEquivalent: Math.floor(totalQuantity / 0.3),
          };

          return (
            <div className="mb-8">
              <AnalyticsCharts
                categoryData={categoryData}
                claimsOverTime={claimsOverTime}
                statusDistribution={statusDistribution}
                impactMetrics={impactMetrics}
              />
            </div>
          );
        })()}

        {/* Recent Claims */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Claims</h2>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Claims</h2>
          {dashboard?.recentClaims && dashboard.recentClaims.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Food Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Claimant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dashboard.recentClaims.map((claim) => (
                    <tr key={claim._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {claim.foodListingId?.foodName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {claim.claimantId?.name || claim.claimantId?.organizationName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {claim.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${getBadgeClass(claim.status)}`}>
                          {claim.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(claim.claimedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No recent claims</p>
          )}
        </div>
      </div>
    </div>
  );
}
