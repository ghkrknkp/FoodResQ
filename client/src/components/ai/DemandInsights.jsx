import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../../services/api';

const COLORS = ['#16a34a', '#ea580c', '#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b', '#10b981'];

export default function DemandInsights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/ai/demand-insights');
      if (response.data.success) {
        setInsights(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      setError(error.response?.data?.message || 'Unable to load AI insights');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-48"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card border-2 border-red-200">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Insights Unavailable</h3>
            <p className="text-sm text-gray-600">{error}</p>
          </div>
        </div>
        <button 
          onClick={fetchInsights}
          className="btn btn-outline"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (insights?.hasInsufficientData) {
    return (
      <div className="card border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">🤖 Building Your AI Profile</h3>
            <p className="text-sm text-gray-600">Collecting data to provide intelligent insights</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-yellow-200">
          <p className="text-gray-700 mb-4">{insights.message}</p>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">Progress</span>
            <span className="text-sm text-gray-600">
              {insights.currentDataPoints} / {insights.minimumDataPoints} listings
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.min((insights.currentDataPoints / insights.minimumDataPoints) * 100, 100)}%` 
              }}
            ></div>
          </div>

          <div className="text-sm text-gray-600">
            <p className="mb-2">
              <strong>What you'll get with more data:</strong>
            </p>
            <ul className="space-y-1 ml-4">
              <li>• Most popular food categories</li>
              <li>• Best times to list food</li>
              <li>• Demand predictions</li>
              <li>• Personalized recommendations</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const categoryChartData = insights.categoryInsights.categoryBreakdown.map(item => ({
    category: item._id,
    successRate: Math.round(item.successRate),
    listings: item.totalListings
  }));

  const pieChartData = insights.categoryInsights.categoryBreakdown.map(item => ({
    name: item._id,
    value: item.totalListings
  }));

  return (
    <div className="card border-2 border-primary-200 bg-gradient-to-r from-primary-50 to-secondary-50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center mr-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H9a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">🤖 AI Demand Insights</h3>
            <p className="text-sm text-gray-600">Data-driven recommendations for better results</p>
          </div>
        </div>
        
        <div className="text-right">
          <span className={`badge ${
            insights.dataQuality.confidence === 'High' ? 'badge-success' :
            insights.dataQuality.confidence === 'Medium' ? 'badge-warning' : 'badge-info'
          }`}>
            {insights.dataQuality.confidence} Confidence
          </span>
          <p className="text-xs text-gray-500 mt-1">{insights.dataQuality.analysisPeriod}</p>
        </div>
      </div>

      {/* Key Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Most Requested</p>
              <p className="text-lg font-bold text-primary-600">
                {insights.categoryInsights.mostPopular.category}
              </p>
              <p className="text-xs text-gray-500">
                {insights.categoryInsights.mostPopular.successRate}% success rate
              </p>
            </div>
            <div className="text-3xl">🏆</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Best Time to List</p>
              <p className="text-lg font-bold text-secondary-600">
                {insights.timingInsights.peakTimeFormatted}
              </p>
              <p className="text-xs text-gray-500">Peak claim activity</p>
            </div>
            <div className="text-3xl">⏰</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-lg font-bold text-green-600">
                {Math.round(insights.performanceMetrics.successRate)}%
              </p>
              <p className="text-xs text-gray-500">
                {insights.performanceMetrics.totalListings} total listings
              </p>
            </div>
            <div className="text-3xl">📈</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Success Rate by Category */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h4 className="text-md font-semibold text-gray-900 mb-3">Success Rate by Category</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="category" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'successRate' ? `${value}%` : value,
                  name === 'successRate' ? 'Success Rate' : 'Listings'
                ]}
              />
              <Bar dataKey="successRate" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h4 className="text-md font-semibold text-gray-900 mb-3">Category Distribution</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h4 className="text-md font-semibold text-gray-900 mb-3">🎯 AI Recommendations</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {insights.recommendations.map((rec, index) => (
            <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-sm text-gray-700">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Data Summary */}
      <div className="mt-4 p-3 bg-gray-100 rounded-lg">
        <p className="text-xs text-gray-600 text-center">
          Analysis based on {insights.dataQuality.totalListings} listings over the last 30 days. 
          Confidence level: {insights.dataQuality.confidence}
        </p>
      </div>
    </div>
  );
}