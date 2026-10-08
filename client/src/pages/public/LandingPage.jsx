import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import api from '../../services/api';

export default function LandingPage() {
  const [featuredFood, setFeaturedFood] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedFood();
  }, []);

  const fetchFeaturedFood = async () => {
    try {
      setLoading(true);
      const response = await api.get('/food?limit=6');
      if (response.data.success) {
        setFeaturedFood(response.data.data || []);
      }
    } catch (err) {
      setError('Failed to load featured food listings');
      console.error('Error fetching featured food:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Turn Surplus Food Into Meaningful Impact
          </h1>
          <p className="text-xl sm:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            Connect restaurants with NGOs and volunteers to reduce food waste and feed communities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/browse" className="btn bg-white text-secondary-600 hover:bg-gray-100">
              Browse Available Food
            </Link>
            <Link to="/register" className="btn border-2 border-white text-white hover:bg-white/10">
              Join the Movement
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              The Food Waste Crisis
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every day, tons of perfectly good food goes to waste while millions go hungry. Together, we can change this.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-5xl font-bold text-primary-600 mb-2">33%</div>
              <div className="text-xl font-semibold text-gray-900 mb-2">Food Wasted</div>
              <p className="text-gray-600">Of all food produced globally ends up in landfills</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-5xl font-bold text-secondary-600 mb-2">828M</div>
              <div className="text-xl font-semibold text-gray-900 mb-2">People Hungry</div>
              <p className="text-gray-600">Face chronic hunger worldwide every day</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-5xl font-bold text-green-600 mb-2">You</div>
              <div className="text-xl font-semibold text-gray-900 mb-2">Can Help</div>
              <p className="text-gray-600">Make a difference by joining our community</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our simple three-step process connects surplus food with those who need it most
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Restaurants List Surplus Food
              </h3>
              <p className="text-gray-600">
                Restaurants post details about excess food including quantity, pickup times, and location
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                NGOs and Volunteers Claim It
              </h3>
              <p className="text-gray-600">
                Organizations and volunteers browse listings and claim food that matches their needs
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Food Reaches Those Who Need It
              </h3>
              <p className="text-gray-600">
                Food is picked up and delivered to communities, reducing waste and feeding the hungry
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Food Listings Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Featured Food Listings
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse some of the available food donations waiting to be claimed
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="skeleton h-40"></div>
                  <div className="p-4 space-y-3">
                    <div className="skeleton h-6 w-3/4"></div>
                    <div className="skeleton h-4 w-1/2"></div>
                    <div className="skeleton h-4 w-full"></div>
                    <div className="skeleton h-4 w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-6 text-center">
              <p className="font-medium">{error}</p>
              <button onClick={fetchFeaturedFood} className="btn btn-outline mt-4">
                Try Again
              </button>
            </div>
          ) : featuredFood.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No food listings available at the moment. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredFood.map((food) => (
                <Link 
                  key={food.id} 
                  to={`/food/${food.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-40 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                    <svg className="w-16 h-16 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">{food.foodName}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="badge badge-info">{food.category}</span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <span>Quantity: {food.quantityAvailable} {food.unit}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{food.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Expires: {formatDate(food.expiryDate)}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className="text-primary-600 font-medium text-sm">View Details →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/browse" className="btn btn-primary">
              View All Listings
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Our Impact
            </h2>
            <p className="text-xl text-white/90">
              Together, we're making a difference
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">2,500+</div>
              <div className="text-xl">Meals Rescued</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">150+</div>
              <div className="text-xl">Partner Organizations</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-xl">Successful Pickups</div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Cards Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How Can You Help?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join FoodResQ in one of these roles and start making an impact today
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border-2 border-gray-200 rounded-lg p-8 text-center hover:border-primary-600 transition-colors">
              <div className="bg-primary-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Restaurant</h3>
              <p className="text-gray-600 mb-6">
                List your surplus food and help reduce waste while feeding your community
              </p>
              <Link to="/register" className="btn btn-primary w-full">
                Sign Up as Restaurant
              </Link>
            </div>
            <div className="bg-white border-2 border-gray-200 rounded-lg p-8 text-center hover:border-primary-600 transition-colors">
              <div className="bg-secondary-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">NGO</h3>
              <p className="text-gray-600 mb-6">
                Claim food donations for your organization and serve your community
              </p>
              <Link to="/register" className="btn btn-secondary w-full">
                Sign Up as NGO
              </Link>
            </div>
            <div className="bg-white border-2 border-gray-200 rounded-lg p-8 text-center hover:border-primary-600 transition-colors">
              <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Volunteer</h3>
              <p className="text-gray-600 mb-6">
                Help with pickups and deliveries to make a direct impact in your area
              </p>
              <Link to="/register" className="btn btn-outline w-full">
                Sign Up as Volunteer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of restaurants, NGOs, and volunteers working together to end food waste and hunger
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/browse" className="btn bg-white text-primary-600 hover:bg-gray-100">
              Browse Food Listings
            </Link>
            <Link to="/register" className="btn border-2 border-white text-white hover:bg-white/10">
              Create an Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-2">FoodResQ</h3>
              <p className="text-gray-400">
                Connecting surplus food with those who need it most
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/browse" className="block text-gray-400 hover:text-white transition-colors">
                  Browse Food
                </Link>
                <Link to="/login" className="block text-gray-400 hover:text-white transition-colors">
                  Login
                </Link>
                <Link to="/register" className="block text-gray-400 hover:text-white transition-colors">
                  Register
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-gray-400">
                Email: info@foodresq.com<br />
                Phone: (555) 123-4567
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} FoodResQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
