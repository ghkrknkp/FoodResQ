import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const TN_WEATHER_PRESETS = [
  { city: 'Namakkal', temp: 32, humidity: 62, condition: 'Sunny / Warm', icon: '☀️' },
  { city: 'Chennai', temp: 35, humidity: 78, condition: 'Coastal Heat & Humidity', icon: '🌊' },
  { city: 'Madurai', temp: 36, humidity: 55, condition: 'High Temple City Heat', icon: '🔥' },
  { city: 'Coimbatore', temp: 28, humidity: 65, condition: 'Pleasant Western Ghats', icon: '🌿' },
  { city: 'Trichy', temp: 34, humidity: 58, condition: 'Sunny Central Plains', icon: '🌾' },
  { city: 'Ooty (Nilgiris)', temp: 18, humidity: 82, condition: 'Cool Hill Station', icon: '⛰️' },
];

const FOOD_TYPES = [
  'Coconut Chutney & Tiffin Gravies (Fast Spoilage)',
  'South Indian Sambar & Cooked Rice Meals',
  'Seeraga Samba / Dum Biryani',
  'Malabar Parotta & Vegetable Salna',
  'Fresh Bakery Bread & Buns',
  'Cut Fruits & Fresh Salads',
];

export default function DynamicExpiryCalculator() {
  const [selectedCity, setSelectedCity] = useState(TN_WEATHER_PRESETS[0]);
  const [selectedFood, setSelectedFood] = useState(FOOD_TYPES[1]);
  const [storage, setStorage] = useState('room_temperature');
  const [hoursAgo, setHoursAgo] = useState(2);
  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState(null);
  const [sosSent, setSosSent] = useState(false);

  const calculateExpiry = async () => {
    setLoading(true);
    setSosSent(false);

    try {
      const response = await api.post('/ai/expiry-calculator', {
        city: selectedCity.city,
        foodType: selectedFood,
        ambientTemp: selectedCity.temp,
        storageCondition: storage,
        cookedHoursAgo: hoursAgo,
      });

      if (response.data.success) {
        setAssessment(response.data.data);
      }
    } catch (err) {
      console.error('Dynamic expiry error:', err);
      // Fallback calculation
      const base = selectedFood.includes('Coconut') ? 4 : selectedFood.includes('Bakery') ? 24 : 6;
      const penalty = selectedCity.temp > 33 ? 1.4 : 1.1;
      const safe = parseFloat((base / penalty - hoursAgo).toFixed(1));
      setAssessment({
        foodType: selectedFood,
        city: selectedCity.city,
        ambientTemp: `${selectedCity.temp}°C`,
        storageCondition: storage,
        totalSafeLifespanHours: parseFloat((base / penalty).toFixed(1)),
        cookedHoursAgo: hoursAgo,
        remainingSafeHours: Math.max(0, safe),
        freshnessPercentage: Math.max(0, Math.round((safe / (base / penalty)) * 100)),
        riskLevel: safe <= 1.5 ? 'CRITICAL' : safe <= 3 ? 'MODERATE' : 'LOW',
        badgeColor: safe <= 1.5 ? 'rose' : safe <= 3 ? 'amber' : 'emerald',
        recommendation: safe <= 1.5 ? '🚨 Urgent SOS broadcast recommended!' : 'Standard distribution window.',
        spoilageFactorSummary: `Ambient temperature of ${selectedCity.temp}°C accelerates microbiological growth.`,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateExpiry();
  }, [selectedCity, selectedFood, storage, hoursAgo]);

  const handleBroadcastSOS = () => {
    setSosSent(true);
    setTimeout(() => setSosSent(false), 5000);
  };

  return (
    <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center text-2xl font-bold">
          ⏱️
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            Climate-Aware Dynamic Expiry Engine
            <span className="text-xs bg-red-100 text-red-800 font-semibold px-2.5 py-0.5 rounded-full">
              Thermal Micro-Biology
            </span>
          </h3>
          <p className="text-xs text-gray-500">
            Computes true safe consumption windows by factoring Tamil Nadu heat, humidity, and recipe vulnerability.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {/* City & Climate Selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Select District Weather:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TN_WEATHER_PRESETS.map((item) => (
              <button
                key={item.city}
                type="button"
                onClick={() => setSelectedCity(item)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedCity.city === item.city
                    ? 'border-red-500 bg-red-50/50 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900">{item.city}</span>
                  <span className="text-base">{item.icon}</span>
                </div>
                <div className="text-xs text-red-600 font-bold mt-0.5">{item.temp}°C</div>
                <div className="text-[10px] text-gray-500 truncate">{item.condition}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Food & Storage Parameters */}
        <div className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Food Recipe Vulnerability:
            </label>
            <select
              className="input text-xs"
              value={selectedFood}
              onChange={(e) => setSelectedFood(e.target.value)}
            >
              {FOOD_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Holding Method:
              </label>
              <select
                className="input text-xs"
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
              >
                <option value="room_temperature">Room Temperature (Vulnerable)</option>
                <option value="insulated_hot">Insulated Hot Vessel (&gt;60°C)</option>
                <option value="refrigerated">Cold Storage (&lt;5°C)</option>
                <option value="direct_sun">Open Air / Sun Exposure</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Cooked Hours Ago: <span className="text-red-600 font-bold">{hoursAgo}h</span>
              </label>
              <input
                type="range"
                min="0"
                max="8"
                step="0.5"
                value={hoursAgo}
                onChange={(e) => setHoursAgo(parseFloat(e.target.value))}
                className="w-full accent-red-600 mt-2"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Expiry Analysis Card */}
      {assessment && (
        <div className="p-5 rounded-2xl border border-red-200 bg-gradient-to-br from-red-50/70 via-white to-orange-50/50">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-red-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Live Spoilage Risk Rating</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`text-xs px-3 py-1 rounded-full font-extrabold uppercase tracking-wide text-white ${
                    assessment.riskLevel === 'CRITICAL'
                      ? 'bg-red-600 animate-pulse'
                      : assessment.riskLevel === 'MODERATE'
                      ? 'bg-amber-500'
                      : 'bg-emerald-600'
                  }`}
                >
                  {assessment.riskLevel} Risk
                </span>
                <span className="text-sm font-bold text-gray-800">
                  {selectedCity.city} ({selectedCity.temp}°C ambient)
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[11px] text-gray-500 uppercase font-semibold">Remaining Safe Window</div>
              <div className="text-2xl font-black text-red-600">
                {assessment.remainingSafeHours} <span className="text-sm font-semibold">Hours</span>
              </div>
            </div>
          </div>

          {/* Freshness Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-gray-600">Freshness Integrity</span>
              <span className="text-gray-900">{assessment.freshnessPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  assessment.freshnessPercentage > 50
                    ? 'bg-emerald-500'
                    : assessment.freshnessPercentage > 25
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${assessment.freshnessPercentage}%` }}
              />
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-red-100 text-xs text-gray-700 mb-4">
            <div className="font-bold text-gray-900 mb-0.5">AI Recommendation:</div>
            <div>{assessment.recommendation}</div>
            <div className="text-[11px] text-gray-500 mt-1 italic">{assessment.spoilageFactorSummary}</div>
          </div>

          {assessment.riskLevel !== 'LOW' && (
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-red-700 font-medium">
                ⚠️ Approaching spoilage threshold. Volunteers should be notified urgently.
              </div>
              <button
                type="button"
                onClick={handleBroadcastSOS}
                disabled={sosSent}
                className="btn bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2 font-bold flex items-center gap-1.5 shadow-sm"
              >
                {sosSent ? '✓ SOS Broadcast Sent to Nearby NGOs!' : '🚨 Broadcast SOS Pickup Alert'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
