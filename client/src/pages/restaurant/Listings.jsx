import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function Listings() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    filterListings();
  }, [activeFilter, listings]);

  const fetchListings = async () => {
    try {
      setError('');
      const response = await api.get('/food/my/listings');
      if (response.data.success) {
        setListings(response.data.data);
        setFilteredListings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      setError(error.response?.data?.message || 'Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const filterListings = () => {
    if (activeFilter === 'All') {
      setFilteredListings(listings);
    } else {
      setFilteredListings(listings.filter(listing => listing.status === activeFilter));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      const response = await api.delete(`/food/${id}`);
      if (response.data.success) {
        fetchListings();
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert(error.response?.data?.message || 'Failed to delete listing');
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8 skeleton"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg skeleton"></div>
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
            <p className="text-gray-600 mt-2">Manage your food listings</p>
          </div>
          <Link to="/restaurant/listings/create" className="btn btn-primary">
            + Create New Listing
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto">
          {['All', 'AVAILABLE', 'CLAIMED', 'COMPLETED', 'EXPIRED'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Listings Grid */}
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <div key={listing._id} className="card">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {listing.foodName}
                    </h3>
                    <span className="badge badge-info text-xs mt-1">
                      {listing.category}
                    </span>
                  </div>
                  <span className={`badge ${getBadgeClass(listing.status)}`}>
                    {listing.status}
                  </span>
                </div>

                {listing.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {listing.description}
                  </p>
                )}

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span className="font-medium">{listing.quantity} {listing.unit}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{listing.pickupLocation}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Expires: {new Date(listing.expiryTime).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <Link
                    to={`/food/${listing._id}`}
                    className="btn btn-outline text-sm flex-1"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(listing._id)}
                    className="btn btn-outline text-sm text-red-600 border-red-300 hover:bg-red-50 flex-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings yet</h3>
            <p className="text-gray-600 mb-4">
              {activeFilter === 'All' 
                ? 'Create your first food listing to get started'
                : `No ${activeFilter.toLowerCase()} listings found`}
            </p>
            {activeFilter === 'All' && (
              <Link to="/restaurant/listings/create" className="btn btn-primary">
                + Create New Listing
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
