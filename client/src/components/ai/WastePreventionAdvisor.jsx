import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WEATHERS = ['Sunny & Clear (Normal Dine-in)', 'Rainy / Monsoon Shower (Reduced Footfall)', 'Hot & Humid (High Spoilage Risk)'];

export default function WastePreventionAdvisor() {
  const [city, setCity] = useState('Namakkal');
  const [dayOfWeek, setDayOfWeek] = useState('Sunday');
  const [weather, setWeather] = useState(WEATHERS[0]);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchForecast = async () => {
    setLoading(true);

    try {
      const response = await api.get('/ai/waste-forecast', {
        params: { city, dayOfWeek, weather },
      });

      if (response.data.success) {
        setForecast(response.data.data);
      }
    } catch (err) {
      console.error('Waste forecast error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, [city, dayOfWeek, weather]);

  return (
    <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center text-2xl font-bold">
          🔮
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            Predictive Kitchen Waste Prevention Advisor
            <span className="text-xs bg-purple-100 text-purple-800 font-semibold px-2.5 py-0.5 rounded-full">
              Pre-Cooking Waste AI
            </span>
          </h3>
          <p className="text-xs text-gray-500">
            Prevents food waste before it is even cooked by forecasting excess batch preparation based on local patterns.
          </p>
        </div>
      </div>

      {/* Forecast Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-purple-50/40 rounded-xl border border-purple-100 mb-5">
        <div>
          <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Kitchen Location:
          </label>
          <select
            className="input text-xs"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="Namakkal">Namakkal</option>
            <option value="Chennai">Chennai</option>
            <option value="Coimbatore">Coimbatore</option>
            <option value="Madurai">Madurai</option>
            <option value="Salem">Salem</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Day of Week:
          </label>
          <select
            className="input text-xs"
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
          >
            {DAYS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Weather Forecast:
          </label>
          <select
            className="input text-xs"
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
          >
            {WEATHERS.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Forecast Output */}
      {forecast && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-200">
              <div className="text-[10px] text-purple-700 uppercase font-bold">Predicted Surplus Rate</div>
              <div className="text-3xl font-black text-purple-900 mt-0.5">
                {forecast.predictedSurplusPercentage}%
              </div>
              <div className="text-[11px] text-purple-700 mt-1">{forecast.riskLevel}</div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-gray-200 sm:col-span-2">
              <div className="text-[10px] text-gray-500 uppercase font-bold">Estimated Cost Savings</div>
              <div className="text-xl font-bold text-emerald-600 mt-0.5">
                {forecast.preventativeSavingsEstimate}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                By adjusting batch quantities before morning and afternoon prep starts.
              </div>
            </div>
          </div>

          {/* Actionable Batch Adjustments */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">
              Recommended Batch Prep Adjustments for Kitchen:
            </div>

            <div className="space-y-2.5">
              {forecast.suggestedBatchAdjustments?.map((adj, i) => (
                <div
                  key={i}
                  className="p-3 bg-white rounded-xl border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <span>🍲 {adj.dish}</span>
                      <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                        {adj.adjustment}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{adj.reason}</div>
                  </div>
                </div>
              ))}
            </div>

            {forecast.insights?.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600 space-y-1">
                {forecast.insights.map((ins, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span>💡</span>
                    <span>{ins}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
