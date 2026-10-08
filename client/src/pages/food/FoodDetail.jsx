import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function FoodDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [claimQuantity, setClaimQuantity] = useState(1);
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState(null);
  const [claimSuccess, setClaimSuccess] = useState(false);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/food/${id}`);
      if (response.data.success) {
        setListing(response.data.data);
        setClaimQuantity(1);
      }
    } catch (err) {
      setError('Failed to load food listing. Please try again.');
      console.error('Error fetching listing:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!claimQuantity || claimQuantity < 1 || claimQuantity > listing.quantityAvailable) {
      setClaimError(`Please enter a quantity between 1 and ${listing.quantityAvailable}`);
      return;
    }

    try {
      setClaiming(true);
      setClaimError(null);
      const response = await api.post(`/food/${id}/claims`, { quantity: claimQuantity });
      
      if (response.data.success) {
        setClaimSuccess(true);
        setTimeout(() => {
          navigate('/claims');
        }, 2000);
      }
    } catch (err) {
      setClaimError(err.response?.data?.message || 'Failed to claim food. Please try again.');
      console.error('Error claiming food:', err);
    } finally {
      setClaiming(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      AVAILABLE: { class: 'badge-success', text: 'Available' },
      CLAIMED: { class: 'badge-info', text: 'Claimed' },
      COMPLETED: { class: 'badge-gray', text: 'Completed' },
      EXPIRED: { class: 'badge-danger', text: 'Expired' }
    };
    const config = statusConfig[status] || { class: 'badge-gray', text: status };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const canClaim = () => {
    if (!isAuthenticated) return { allowed: false, reason: 'login' };
    if (user.role === 'RESTAURANT') return { allowed: false, reason: 'restaurant' };
    if (listing.status !== 'AVAILABLE') return { allowed: false, reason: 'status' };
    
    const now = new Date();
    const expiry = new Date(listing.expiryDate);
    if (expiry < now) return { allowed: false, reason: 'expired' };
    
    return { allowed: true };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
              <div className="lg:col-span-2">
                <div className="skeleton h-64 lg:h-80 rounded-lg mb-6"></div>
                <div className="skeleton h-8 w-3/4 mb-4"></div>
                <div className="skeleton h-24 mb-6"></div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="skeleton h-20"></div>
                  <div className="skeleton h-20"></div>
                  <div className="skeleton h-20"></div>
                  <div className="skeleton h-20"></div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="skeleton h-64 rounded-lg"></div>
              </div>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-6 text-center">
            <p className="font-medium">{error}</p>
            <button onClick={fetchListing} className="btn btn-outline mt-4">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return null;
  }

  const claimability = canClaim();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 mb-8 lg:mb-0">
            {/* Image */}
            <div className="h-64 lg:h-80 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-32 h-32 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 mb-4">
              <span className="badge badge-info">{listing.category}</span>
              {getStatusBadge(listing.status)}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{listing.foodName}</h1>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {listing.description || 'No description provided.'}
              </p>
            </div>

            {/* Details Grid */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Quantity Available</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {listing.quantityAvailable} {listing.unit}
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Location</div>
                  <div className="text-lg font-semibold text-gray-900">{listing.location}</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Pickup Deadline</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatDate(listing.pickupDeadline)}
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Expiry Date</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatDate(listing.expiryDate)}
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Category</div>
                  <div className="text-lg font-semibold text-gray-900">{listing.category}</div>
                </div>
                {listing.storageInstructions && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Storage Instructions</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {listing.storageInstructions}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Provider Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Provider Information</h2>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-600">Name: </span>
                  <span className="font-medium text-gray-900">
                    {listing.provider?.name || 'N/A'}
                  </span>
                </div>
                {listing.provider?.organizationName && (
                  <div>
                    <span className="text-gray-600">Organization: </span>
                    <span className="font-medium text-gray-900">
                      {listing.provider.organizationName}
                    </span>
                  </div>
                )}
                {listing.provider?.contactInfo && (
                  <div>
                    <span className="text-gray-600">Contact: </span>
                    <span className="font-medium text-gray-900">
                      {listing.provider.contactInfo}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Claim This Food</h2>

              {claimSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 mb-4">
                  <p className="font-medium">Claim successful!</p>
                  <p className="text-sm mt-1">Redirecting to your claims...</p>
                </div>
              )}

              {claimError && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-4">
                  <p className="text-sm">{claimError}</p>
                </div>
              )}

              {!claimability.allowed && claimability.reason === 'login' && (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">Please log in to claim food</p>
                  <Link to="/login" className="btn btn-primary w-full mb-2">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-outline w-full">
                    Register
                  </Link>
                </div>
              )}

              {!claimability.allowed && claimability.reason === 'restaurant' && (
                <div className="bg-gray-50 border border-gray-200 text-gray-600 rounded-lg p-4">
                  <p>Restaurants cannot claim food listings.</p>
                </div>
              )}

              {!claimability.allowed && claimability.reason === 'status' && (
                <div className="bg-gray-50 border border-gray-200 text-gray-600 rounded-lg p-4">
                  <p>
                    {listing.status === 'CLAIMED' && 'This listing has already been claimed.'}
                    {listing.status === 'COMPLETED' && 'This listing has been completed.'}
                    {listing.status === 'EXPIRED' && 'This listing has expired.'}
                    {!['CLAIMED', 'COMPLETED', 'EXPIRED'].includes(listing.status) && 
                      'This listing is not available for claiming.'}
                  </p>
                </div>
              )}

              {!claimability.allowed && claimability.reason === 'expired' && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
                  <p>This listing has expired.</p>
                </div>
              )}

              {claimability.allowed && !claimSuccess && (
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity to Claim
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={listing.quantityAvailable}
                      value={claimQuantity}
                      onChange={(e) => setClaimQuantity(parseInt(e.target.value) || 1)}
                      className="input"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Available: {listing.quantityAvailable} {listing.unit}
                    </p>
                  </div>

                  <button
                    onClick={handleClaim}
                    disabled={claiming}
                    className="btn btn-primary w-full"
                  >
                    {claiming ? 'Claiming...' : 'Claim Food'}
                  </button>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link to="/browse" className="btn btn-outline w-full">
                  ← Back to Browse
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
