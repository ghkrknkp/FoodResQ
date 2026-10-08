import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import api from '../../services/api';

export default function MyClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const response = await api.get('/claims');
      if (response.data.success) {
        setClaims(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateClaimStatus = async (claimId, newStatus) => {
    try {
      const response = await api.put(`/claims/${claimId}`, { status: newStatus });
      if (response.data.success) {
        fetchClaims();
      }
    } catch (error) {
      console.error('Error updating claim:', error);
      alert(error.response?.data?.message || 'Failed to update claim');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      CLAIMED: 'badge-info',
      PICKUP_PENDING: 'badge-warning',
      COLLECTED: 'badge-success',
      COMPLETED: 'badge-success',
      CANCELLED: 'badge-gray',
    };
    return colors[status] || 'badge-gray';
  };

  const filteredClaims = claims.filter(claim => {
    if (filter === 'all') return true;
    if (filter === 'active') return ['CLAIMED', 'PICKUP_PENDING', 'COLLECTED'].includes(claim.status);
    if (filter === 'completed') return claim.status === 'COMPLETED';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Claims</h1>
          <p className="text-gray-600">Track and manage your food claims</p>
        </div>

        {/* Filter Tabs */}
        <div className="card mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 font-medium transition-colors ${
                filter === 'all'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All ({claims.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 font-medium transition-colors ${
                filter === 'active'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 font-medium transition-colors ${
                filter === 'completed'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Claims List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredClaims.length > 0 ? (
          <div className="space-y-4">
            {filteredClaims.map((claim) => (
              <div key={claim._id} className="card hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1 mb-4 md:mb-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {claim.foodListingId?.foodName || 'Food Item'}
                      </h3>
                      <span className={`badge ${getStatusColor(claim.status)}`}>
                        {claim.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Quantity:</span> {claim.quantity} {claim.foodListingId?.unit}
                      </div>
                      <div>
                        <span className="font-medium">Provider:</span>{' '}
                        {claim.foodListingId?.providerId?.organizationName || claim.foodListingId?.providerId?.name}
                      </div>
                      <div>
                        <span className="font-medium">Location:</span> {claim.foodListingId?.pickupLocation}
                      </div>
                      <div>
                        <span className="font-medium">Claimed:</span> {new Date(claim.claimedAt).toLocaleDateString()}
                      </div>
                    </div>

                    {claim.foodListingId?.pickupDeadline && (
                      <div className="mt-2 text-sm text-gray-700">
                        <span className="font-medium">Pickup by:</span>{' '}
                        {new Date(claim.foodListingId.pickupDeadline).toLocaleString()}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    {claim.status === 'CLAIMED' && (
                      <button
                        onClick={() => updateClaimStatus(claim._id, 'PICKUP_PENDING')}
                        className="btn btn-primary text-sm"
                      >
                        Mark Ready for Pickup
                      </button>
                    )}
                    {claim.status === 'PICKUP_PENDING' && (
                      <button
                        onClick={() => updateClaimStatus(claim._id, 'COLLECTED')}
                        className="btn btn-primary text-sm"
                      >
                        Mark as Collected
                      </button>
                    )}
                    {claim.status === 'COLLECTED' && (
                      <button
                        onClick={() => updateClaimStatus(claim._id, 'COMPLETED')}
                        className="btn btn-primary text-sm"
                      >
                        Mark as Completed
                      </button>
                    )}
                    <Link
                      to={`/food/${claim.foodListingId?._id}`}
                      className="btn btn-outline text-sm text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No claims yet</h3>
            <p className="text-gray-600 mb-6">Start claiming food donations to see them here</p>
            <Link to="/browse" className="btn btn-primary">
              Browse Available Food
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
