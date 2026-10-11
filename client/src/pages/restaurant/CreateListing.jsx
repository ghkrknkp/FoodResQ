import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import ListingAssistant from '../../components/ai/ListingAssistant';
import ImageUpload from '../../components/ui/ImageUpload';

export default function CreateListing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    foodName: '',
    category: '',
    description: '',
    quantity: '',
    unit: 'kg',
    pickupLocation: user?.address || '',
    availableFrom: '',
    pickupDeadline: '',
    expiryTime: '',
    image: '',
  });

  useEffect(() => {
    if (location.state?.aiPrefill) {
      handleApplyAIResult(location.state.aiPrefill);
    }
  }, [location.state]);

  const validateField = (name, value) => {
    switch (name) {
      case 'foodName':
        return value.trim() ? null : 'Food name is required';
      case 'category':
        return value ? null : 'Category is required';
      case 'quantity':
        if (!value) return 'Quantity is required';
        if (Number(value) <= 0) return 'Quantity must be greater than 0';
        return null;
      case 'expiryTime': {
        if (!value) return 'Expiry time is required';
        const now = new Date();
        const expiry = new Date(value);
        if (expiry <= now) return 'Expiry time must be in the future';
        return null;
      }
      default:
        return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is corrected
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const errorMsg = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const handleApplyAIResult = (aiResult) => {
    const now = new Date();
    const defaultAvail = now.toISOString().slice(0, 16);
    const defaultDeadline = new Date(now.getTime() + 4 * 3600000).toISOString().slice(0, 16);
    const defaultExpiry = new Date(now.getTime() + 6 * 3600000).toISOString().slice(0, 16);

    setFormData(prev => ({
      ...prev,
      foodName: aiResult.suggestedTitle || aiResult.foodName || prev.foodName,
      category: aiResult.category || prev.category,
      description: aiResult.enhancedDescription || aiResult.description || prev.description,
      quantity: aiResult.quantity ? String(aiResult.quantity) : prev.quantity,
      unit: aiResult.unit || prev.unit,
      image: aiResult.image || prev.image,
      availableFrom: prev.availableFrom || defaultAvail,
      pickupDeadline: aiResult.pickupDeadline || prev.pickupDeadline || defaultDeadline,
      expiryTime: aiResult.expiryTime || prev.expiryTime || defaultExpiry,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate all required fields
    const fieldsToValidate = ['foodName', 'category', 'quantity', 'expiryTime'];
    const newErrors = {};
    fieldsToValidate.forEach((name) => {
      const err = validateField(name, formData[name]);
      if (err) newErrors[name] = err;
    });

    // Also check non-validated required fields
    if (!formData.pickupLocation || !formData.availableFrom || !formData.pickupDeadline) {
      setError('Please fill in all required fields');
      setFieldErrors(newErrors);
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
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

        {/* AI Listing Assistant */}
        <ListingAssistant onApplyResult={handleApplyAIResult} isLoading={loading} />

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
                onBlur={handleBlur}
                className="input w-full"
                placeholder="e.g., Fresh Sandwiches"
                required
              />
              {fieldErrors.foodName && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.foodName}</p>
              )}
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
                onBlur={handleBlur}
                className="input w-full"
                required
              >
                <option value="">Select Category</option>
                <option value="Tamil Nadu Traditional">Tamil Nadu Traditional (Meals, Sambar, Idli, Dosa)</option>
                <option value="South Indian Specials">South Indian Specials</option>
                <option value="Prepared Meals">Prepared Meals</option>
                <option value="Bakery">Bakery</option>
                <option value="Fruits">Fruits</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Packaged Food">Packaged Food</option>
                <option value="Other">Other</option>
              </select>
              {fieldErrors.category && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.category}</p>
              )}
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
                onBlur={handleBlur}
                min="1"
                step="0.01"
                className="input w-full"
                placeholder="0"
                required
              />
              {fieldErrors.quantity && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.quantity}</p>
              )}
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
              onBlur={handleBlur}
              className="input w-full"
              required
            />
            {fieldErrors.expiryTime && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.expiryTime}</p>
            )}
          </div>

          {/* Food Image */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Food Image
            </label>
            <ImageUpload
              value={formData.image}
              onChange={(url) => setFormData({ ...formData, image: url })}
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
