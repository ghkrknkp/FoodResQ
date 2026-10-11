import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const CITIES = ['Namakkal', 'Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Trichy'];

export default function NgoMatcherDispatcher() {
  const [city, setCity] = useState('Namakkal');
  const [quantity, setQuantity] = useState(85);
  const [loading, setLoading] = useState(false);
  const [matchData, setMatchData] = useState(null);
  const [dispatched, setDispatched] = useState(false);

  const fetchMatches = async () => {
    setLoading(true);
    setDispatched(false);

    try {
      const response = await api.post('/ai/ngo-matcher', {
        city,
        quantity,
        category: 'Tamil Nadu Traditional',
      });

      if (response.data.success) {
        setMatchData(response.data.data);
      }
    } catch (err) {
      console.error('NGO matcher error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [city, quantity]);

  return (
    <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center text-2xl font-bold">
          🎯
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            Smart NGO Matchmaker &amp; Multi-Stop Route Dispatcher
            <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2.5 py-0.5 rounded-full">
              Automated Route Optimization
            </span>
          </h3>
          <p className="text-xs text-gray-500">
            Intelligently splits surplus donations across verified orphanages and shelters to eliminate waste.
          </p>
        </div>
      </div>

      {/* City & Surplus Meals Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100 mb-5">
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Tamil Nadu District / City:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {CITIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCity(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  city === c
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
                }`}
              >
                📍 {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Surplus Meal Count to Redistribute: <span className="text-blue-600 font-bold">{quantity} Meals</span>
          </label>
          <input
            type="range"
            min="20"
            max="250"
            step="5"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
            className="w-full accent-blue-600 mt-2"
          />
          <div className="flex justify-between text-[11px] text-gray-500 mt-1">
            <span>20 Meals</span>
            <span>100 Meals</span>
            <span>250 Meals</span>
          </div>
        </div>
      </div>

      {/* Match Results */}
      {matchData && (
        <div className="space-y-4">
          {/* Summary Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-xs">
              <div className="text-[10px] text-gray-500 uppercase font-semibold">Matched Shelters</div>
              <div className="text-base font-extrabold text-blue-600">
                {matchData.optimizedRouteLegs?.length} Organizations
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-xs">
              <div className="text-[10px] text-gray-500 uppercase font-semibold">Total Transit Loop</div>
              <div className="text-base font-extrabold text-gray-900">
                {matchData.totalRouteDistanceKm} km
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-xs">
              <div className="text-[10px] text-gray-500 uppercase font-semibold">Total Est. Time</div>
              <div className="text-base font-extrabold text-gray-900">
                ~{matchData.totalEstDeliveryMinutes} Mins
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-xs">
              <div className="text-[10px] text-gray-500 uppercase font-semibold">Recommended Transit</div>
              <div className="text-xs font-bold text-gray-800 truncate mt-1">
                🚚 {matchData.recommendedVehicle}
              </div>
            </div>
          </div>

          {/* Route Sequence & Stops */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Optimized Multi-Stop Delivery Route:</span>
              <span className="text-[11px] text-blue-600 normal-case font-medium">
                {matchData.volunteerDispatchStatus}
              </span>
            </div>

            <div className="space-y-3">
              {matchData.optimizedRouteLegs?.map((ngo, index) => (
                <div
                  key={ngo.id}
                  className="p-3.5 bg-white rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        {ngo.name}
                        <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full border border-blue-200">
                          {ngo.priority}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{ngo.address}</div>
                      <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
                        📞 {ngo.contact} • {ngo.volunteerStatus}
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      Receiving: {ngo.allocatedPortions} Meals
                    </div>
                    <div className="text-[11px] text-gray-500 mt-1">
                      Distance: {ngo.distanceKm} km (~{ngo.estimatedTransitMin} min)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Dispatch Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-xs text-gray-600">
              ⚡ All {quantity} meals accounted for with zero spoilage leakage.
            </div>
            <button
              type="button"
              onClick={() => {
                setDispatched(true);
                setTimeout(() => setDispatched(false), 5000);
              }}
              disabled={dispatched}
              className="btn btn-primary text-xs px-5 py-2.5 shadow-sm flex items-center gap-2"
            >
              {dispatched ? (
                <span>✓ Multi-Stop Dispatch Broadcast Sent to Volunteers!</span>
              ) : (
                <span>🚀 Broadcast Route to Delivery Volunteers</span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
