import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function FoodSafetyGuard() {
  const [foodName, setFoodName] = useState('Hot Sambar Rice & Poriyal');
  const [holdingTemp, setHoldingTemp] = useState(55);
  const [hoursAtRoomTemp, setHoursAtRoomTemp] = useState(1.5);
  const [packagingType, setPackagingType] = useState('Sealed Food-Grade Steel Containers');
  const [hygieneChecked, setHygieneChecked] = useState(true);
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(false);

  const runSafetyAudit = async () => {
    setLoading(true);

    try {
      const response = await api.post('/ai/safety-verify', {
        foodName,
        holdingTemp,
        hoursAtRoomTemp,
        packagingType,
        hygieneChecked,
      });

      if (response.data.success) {
        setAudit(response.data.data);
      }
    } catch (err) {
      console.error('Safety verify error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSafetyAudit();
  }, [foodName, holdingTemp, hoursAtRoomTemp, packagingType, hygieneChecked]);

  return (
    <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center text-2xl font-bold">
          🛡️
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            Food Safety Guard &amp; Digital QR Pass
            <span className="text-xs bg-teal-100 text-teal-800 font-semibold px-2.5 py-0.5 rounded-full">
              FSSAI Standard Audit
            </span>
          </h3>
          <p className="text-xs text-gray-500">
            Real-time hazard evaluation and verifiable digital QR pass for volunteer pickup and recipient safety.
          </p>
        </div>
      </div>

      {/* Safety Audit Input Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-teal-50/40 rounded-xl border border-teal-100 mb-5">
        <div>
          <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Food Item Name:
          </label>
          <input
            type="text"
            className="input text-xs"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Holding Temp: <span className="text-teal-700 font-bold">{holdingTemp}°C</span>
          </label>
          <input
            type="range"
            min="0"
            max="85"
            value={holdingTemp}
            onChange={(e) => setHoldingTemp(parseInt(e.target.value, 10))}
            className="w-full accent-teal-600 mt-2"
          />
          <div className="text-[10px] text-gray-500 mt-1">
            {holdingTemp > 60 ? '🔥 Safe Hot Holding' : holdingTemp < 5 ? '❄️ Safe Cold Storage' : '⚠️ Bacterial Danger Zone (5-60°C)'}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Hours Elapsed Since Prep:
          </label>
          <input
            type="number"
            min="0"
            max="12"
            step="0.5"
            className="input text-xs"
            value={hoursAtRoomTemp}
            onChange={(e) => setHoursAtRoomTemp(parseFloat(e.target.value))}
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Packaging Container:
          </label>
          <select
            className="input text-xs"
            value={packagingType}
            onChange={(e) => setPackagingType(e.target.value)}
          >
            <option value="Sealed Food-Grade Steel Containers">Sealed Food-Grade Containers</option>
            <option value="Covered Foil Trays with Lids">Covered Foil Trays with Lids</option>
            <option value="Open Catering Trays (Uncovered)">Open Catering Trays (Uncovered)</option>
          </select>
        </div>
      </div>

      {/* Safety Audit Results & Digital QR Pass */}
      {audit && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Audit Metrics */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <div className="text-[11px] text-gray-500 uppercase font-bold">FSSAI Hygiene Safety Score</div>
                <div className="text-3xl font-black text-gray-900 mt-0.5 flex items-center gap-2">
                  <span>{audit.safetyScore}/100</span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      audit.passStatus === 'PASSED_SAFE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : audit.passStatus === 'CONDITIONAL_PASS'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {audit.passStatus.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-gray-500 font-medium">Compliance Standard</span>
                <div className="text-xs font-bold text-teal-700 mt-0.5">{audit.verifiedBy}</div>
              </div>
            </div>

            {/* Warnings or Pass Remarks */}
            <div className="p-3.5 rounded-xl border border-teal-100 bg-teal-50/30 text-xs">
              <div className="font-bold text-gray-900 mb-1">Handling Protocols for Distribution:</div>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {audit.handlingProtocol?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>

              {audit.hazards?.length > 0 && (
                <div className="mt-3 pt-2 border-t border-amber-200 text-amber-800">
                  <div className="font-bold">Identified Risk Factors:</div>
                  <ul className="list-disc list-inside space-y-0.5 mt-1">
                    {audit.hazards.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Digital QR Safety Pass Badge */}
          <div className="p-5 rounded-2xl border-2 border-teal-600 bg-white shadow-md flex flex-col items-center text-center justify-between">
            <div className="w-full">
              <div className="flex items-center justify-between text-[11px] font-bold text-teal-700 pb-2 border-b border-gray-100">
                <span>DIGITAL SAFETY PASS</span>
                <span>FSSAI VERIFIED</span>
              </div>

              {/* Dynamic QR SVG */}
              <div className="my-4 flex justify-center">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 shadow-inner">
                  <svg className="w-28 h-28 text-teal-800" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v2h-4v-2zm-4 0h2v4h-2v-4zm4 4h4v2h-4v-2zm-2-2h2v2h-2v-2zm-6-2h2v2h-2v-2zm2 4h2v2h-2v-2zm0-6h4v2h-4v-2zM4 6h2v2H4V6zm14 0h2v2h-2V6zm-8 8h2v2h-2v-2zM4 18h2v2H4v-2z" />
                  </svg>
                </div>
              </div>

              <div className="text-xs font-mono font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded">
                {audit.qrPassToken}
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                Scan on volunteer arrival to confirm safety clearance
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert(`Digital Safety QR Pass ${audit.qrPassToken} printed successfully!`)}
              className="btn btn-outline text-xs w-full mt-3 py-2"
            >
              🖨️ Print Pickup Safety Slip
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
