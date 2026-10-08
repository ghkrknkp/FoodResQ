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
  const [claiming, setClaiming] = useState(false);
  const [claimQuantity, setClaimQuantity] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/food/${id}`);
      if (response.data.success) {
        setListing(response.data.data);
        setClaimQuantity(Math.min(1, response.data.data.remainingQuantity));
      }
    } catch (error) {
      console.error('Error fetching listing:', error);
      setError('Failed to load food listing');
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (claimQuantity < 1 || claimQuantity > listing.remainingQuantity) {
      setError(`Please enter a quantity between 1 and ${listing.remainingQuantity}`);
      return;
    }

    setClaiming(true);
    try {
      const response = await api.post(`/food/${id}/claims`, { quantity: claimQuantity });
      if (response.data.success) {
        setSuccess('Food claimed successfully! Check your claims dashboard for details.');
        setTimeout(() => navigate('/claims'), 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to claim food');
    } finally {
      setClaiming(false);
    }
  };

  const canClaim = () => {
    if (!isAuthenticated) return false;
    if (user.role === 'RESTAURANT') return false;
    if (!listing) return false;
    if (listing.status !== 'AVAILABLE') return false;
    if (new Date(listing.expiryTime) < new Date()) return false;
    return true;
  };

  const getExpiryColor = (expiryTime) => {
    const now = new Date();
    const expiry = new Date(expiryTime);
    const hoursUntilExpiry = (expiry - now) / (1000 * 60 * 60);

    if (hoursUntilExpiry <= 6) return 'bg-red-100 text-red-800';
    if (hoursUntilExpiry <= 24) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Food listing not found</h2>
          <Link to="/browse" className="btn btn-primary">Browse Food</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-600">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/browse" className="hover:text-primary-600">Browse</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{listing.foodName}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image */}
            <div className="card mb-8">
              <div className="h-96 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
                <svg className="w-48 h-48 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>

            {/* Details */}
            <div className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.foodName}</h1>
                  <span className="badge badge-info">{listing.category}</span>
                </div>
                <span className={`badge px-3 py-1 text-sm ${getExpiryColor(listing.expiryTime)}`}>
                  {listing.status}
                </span>
              </div>

              <p className="text-gray-700 text-lg mb-6">{listing.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Available Quantity</h3>
                  <p className="text-2xl font-bold text-primary-600">
                    {listing.remainingQuantity} / {listing.quantity} {listing.unit}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Pickup Location</h3>
                  <p className="text-lg text-gray-900">{listing.pickupLocation}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Pickup Deadline</h3>
                  <p className="text-lg text-gray-900">{new Date(listing.pickupDeadline).toLocaleString()}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Expiry Time</h3>
                  <p className="text-lg text-gray-900">{new Date(listing.expiryTime).toLocaleString()}</p>
                </div>
              </div>

              {listing.providerId && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Provider Information</h3>
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-medium">Organization:</span> {listing.providerId.organizationName || listing.providerId.name}
                    </p>
                    {listing.providerId.location && (
                      <p className="text-gray-700">
                        <span className="font-medium">Location:</span> {listing.providerId.location}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Claim Form Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Claim This Food</h2>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                  {success}
                </div>
              )}

              {!isAuthenticated ? (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">Please login to claim food</p>
                  <Link to="/login" className="btn btn-primary w-full">Login</Link>
                </div>
              ) : user.role === 'RESTAURANT' ? (
                <div className="text-center text-gray-600">
                  <p>Restaurants cannot claim food. Switch to an NGO or Volunteer account to claim.</p>
                </div>
              ) : listing.status !== 'AVAILABLE' ? (
                <div className="text-center text-gray-600">
                  <p>This food is no longer available for claiming.</p>
                </div>
              ) : new Date(listing.expiryTime) < new Date() ? (
                <div className="text-center text-gray-600">
                  <p>This food has expired and cannot be claimed.</p>
                </div>
              ) : (
                <form onSubmit={handleClaim}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity to Claim
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={listing.remainingQuantity}
                      className="input"
                      value={claimQuantity}
                      onChange={(e) => setClaimQuantity(parseInt(e.target.value))}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Max: {listing.remainingQuantity} {listing.unit}
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={claiming || !canClaim()}
                    className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {claiming ? 'Claiming...' : 'Claim Food'}
                  </button>

                  <p className="text-xs text-gray-500 mt-3 text-center">
                    By claiming, you agree to pick up the food before the deadline
                  </p>
                </form>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Important Notes</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Ensure timely pickup before expiry</li>
                  <li>• Contact provider for special instructions</li>
                  <li>• Update claim status after collection</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
