import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function CreateListing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    foodName: '',
    category: '',
    description: '',
    quantity: '',
    unit: 'kg',
    pickupLocation: '',
    availableFrom: '',
    pickupDeadline: '',
    expiryTime: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!formData.foodName || !formData.category || !formData.quantity || 
        !formData.pickupLocation || !formData.availableFrom || 
        !formData.pickupDeadline || !formData.expiryTime) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        ...formData,
        quantity: Number(formData.quantity)
      };

      const response = await api.post('/food', submitData);
      
      if (response.data.success) {
        navigate('/restaurant/listings');
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      setError(error.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Listing</h1>
          <p className="text-gray-600 mt-2">List surplus food for redistribution</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Food Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Food Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="foodName"
                value={formData.foodName}
                onChange={handleChange}
                className="input w-full"
                placeholder="e.g., Fresh Sandwiches"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input w-full"
                required
              >
                <option value="">Select Category</option>
                <option value="Prepared Meals">Prepared Meals</option>
                <option value="Bakery">Bakery</option>
                <option value="Fruits">Fruits</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Packaged Food">Packaged Food</option>
                <option value="Beverages">Beverages</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="input w-full"
              placeholder="Additional details about the food..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                step="0.01"
                className="input w-full"
                placeholder="0"
                required
              />
            </div>

            {/* Unit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit <span className="text-red-500">*</span>
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="input w-full"
                required
              >
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
                <option value="portions">portions</option>
                <option value="servings">servings</option>
                <option value="boxes">boxes</option>
                <option value="bags">bags</option>
                <option value="liters">liters</option>
                <option value="pieces">pieces</option>
              </select>
            </div>
          </div>

          {/* Pickup Location */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pickup Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              className="input w-full"
              placeholder="e.g., 123 Main St, Downtown"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Available From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available From <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="availableFrom"
                value={formData.availableFrom}
                onChange={handleChange}
                className="input w-full"
                required
              />
            </div>

            {/* Pickup Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pickup Deadline <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="pickupDeadline"
                value={formData.pickupDeadline}
                onChange={handleChange}
                className="input w-full"
                required
              />
            </div>
          </div>

          {/* Expiry Time */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              name="expiryTime"
              value={formData.expiryTime}
              onChange={handleChange}
              className="input w-full"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
            <Link to="/restaurant/listings" className="btn btn-outline">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Creating...' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
