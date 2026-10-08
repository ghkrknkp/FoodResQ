import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import api from '../../services/api';

export default function LandingPage() {
  const [stats, setStats] = useState({
    totalListings: 0,
    completedDonations: 0,
    activeUsers: 0,
  });
  const [featuredListings, setFeaturedListings] = useState([]);

  useEffect(() => {
    fetchFeaturedListings();
  }, []);

  const fetchFeaturedListings = async () => {
    try {
      const response = await api.get('/food?limit=6&sort=-createdAt');
      if (response.data.success) {
        setFeaturedListings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching featured listings:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Turn Surplus Food Into <span className="text-primary-600">Meaningful Impact</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              FoodResQ connects food providers with NGOs and volunteers to redistribute surplus food before it goes to waste.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/browse" className="btn btn-primary px-8 py-4 text-lg">
                Find Food
              </Link>
              <Link to="/register" className="btn btn-secondary px-8 py-4 text-lg">
                Donate Surplus
              </Link>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="mt-16 flex justify-center">
            <div className="w-full max-w-2xl h-64 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center">
              <svg className="w-48 h-48 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">The Problem</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Food waste is a critical global issue while millions face food insecurity. Surplus food from restaurants often goes to waste when it could feed those in need.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-red-600 mb-2">1.3B</div>
              <div className="text-gray-600">Tons of food wasted annually</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-red-600 mb-2">828M</div>
              <div className="text-gray-600">People face hunger worldwide</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-red-600 mb-2">30%</div>
              <div className="text-gray-600">Of all food produced is wasted</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How FoodResQ Works</h2>
            <p className="text-xl text-gray-600">Simple, fast, and effective</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">List Surplus Food</h3>
              <p className="text-gray-600">Restaurants list available surplus food with pickup details and expiry times</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">NGOs & Volunteers Claim</h3>
              <p className="text-gray-600">Browse, search, and claim food donations with real-time notifications</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Pickup & Redistribute</h3>
              <p className="text-gray-600">Coordinate pickup and redistribute food to those who need it most</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      {featuredListings.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Available Food Donations</h2>
              <p className="text-xl text-gray-600">Fresh listings from restaurants and food providers</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredListings.map((listing) => (
                <Link
                  key={listing._id}
                  to={`/food/${listing._id}`}
                  className="card hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg mb-4 flex items-center justify-center">
                    <svg className="w-24 h-24 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{listing.foodName}</h3>
                  <p className="text-sm text-gray-600 mb-2">{listing.category}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-primary-600 font-medium">{listing.remainingQuantity} {listing.unit}</span>
                    <span className="text-gray-500">{listing.pickupLocation}</span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/browse" className="btn btn-primary">
                Browse All Food
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Impact Statistics */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
            <p className="text-xl opacity-90">Together, we're making a difference</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">🍱</div>
              <div className="text-3xl font-bold mb-1">2,500+</div>
              <div className="opacity-90">Meals Redistributed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">🤝</div>
              <div className="text-3xl font-bold mb-1">150+</div>
              <div className="opacity-90">Organizations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">📦</div>
              <div className="text-3xl font-bold mb-1">500+</div>
              <div className="opacity-90">Successful Pickups</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">🌱</div>
              <div className="text-3xl font-bold mb-1">1.2 Tons</div>
              <div className="opacity-90">Waste Prevented</div>
            </div>
          </div>
        </div>
      </section>

      {/* User Roles */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Who Can Join?</h2>
            <p className="text-xl text-gray-600">FoodResQ is built for everyone in the food redistribution ecosystem</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-5xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold mb-2">Restaurants</h3>
              <p className="text-gray-600 mb-4">List surplus food, track donations, and make an impact</p>
              <Link to="/register" className="btn btn-outline">Join as Restaurant</Link>
            </div>
            <div className="card text-center">
              <div className="text-5xl mb-4">🏢</div>
              <h3 className="text-xl font-semibold mb-2">NGOs</h3>
              <p className="text-gray-600 mb-4">Access food donations for your community programs</p>
              <Link to="/register" className="btn btn-outline">Join as NGO</Link>
            </div>
            <div className="card text-center">
              <div className="text-5xl mb-4">❤️</div>
              <h3 className="text-xl font-semibold mb-2">Volunteers</h3>
              <p className="text-gray-600 mb-4">Help redistribute food and support your community</p>
              <Link to="/register" className="btn btn-outline">Join as Volunteer</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Make an Impact?</h2>
          <p className="text-xl mb-8 opacity-90">Join FoodResQ today and help turn surplus food into meaningful impact</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg">
              Get Started
            </Link>
            <Link to="/browse" className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg">
              Browse Food
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">FoodResQ</h3>
              <p className="text-sm">Turn surplus food into meaningful impact.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/browse" className="hover:text-white">Browse Food</Link></li>
                <li><Link to="/register" className="hover:text-white">Sign Up</Link></li>
                <li><Link to="/login" className="hover:text-white">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-white">How It Works</Link></li>
                <li><Link to="/" className="hover:text-white">Our Impact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <p className="text-sm">Email: contact@foodresq.com</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 FoodResQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
