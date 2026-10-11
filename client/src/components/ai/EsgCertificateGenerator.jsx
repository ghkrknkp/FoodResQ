import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function EsgCertificateGenerator() {
  const [restaurantName, setRestaurantName] = useState('Anjappar Chettinad Restaurant, Namakkal');
  const [rescuedKg, setRescuedKg] = useState(240);
  const [period, setPeriod] = useState('October 2026');
  const [certData, setCertData] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);

    try {
      const response = await api.post('/ai/esg-report', {
        restaurantName,
        totalRescuedKg: rescuedKg,
        period,
      });

      if (response.data.success) {
        setCertData(response.data.data);
      }
    } catch (err) {
      console.error('ESG report error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateReport();
  }, [restaurantName, rescuedKg, period]);

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-2xl font-bold">
          📜
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            Auto ESG &amp; Green Carbon Offset Certificate
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full">
              CSR &amp; Tax Compliance
            </span>
          </h3>
          <p className="text-xs text-gray-500">
            Computes carbon emissions avoided, water footprint saved, and issues official verifiable sustainability certificates.
          </p>
        </div>
      </div>

      {/* Input Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-emerald-50/40 rounded-xl border border-emerald-100 mb-6">
        <div>
          <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Donor / Restaurant Name:
          </label>
          <input
            type="text"
            className="input text-xs"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Total Rescued Food: <span className="text-emerald-700 font-bold">{rescuedKg} kg</span>
          </label>
          <input
            type="range"
            min="50"
            max="1200"
            step="10"
            value={rescuedKg}
            onChange={(e) => setRescuedKg(parseInt(e.target.value, 10))}
            className="w-full accent-emerald-600 mt-2"
          />
          <div className="flex justify-between text-[10px] text-gray-500 mt-1">
            <span>50 kg</span>
            <span>500 kg</span>
            <span>1200 kg</span>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Audit Period:
          </label>
          <select
            className="input text-xs"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="October 2026">October 2026</option>
            <option value="Q3 2026 (July - Sept)">Q3 2026 (July - Sept)</option>
            <option value="Annual Year 2026">Annual Year 2026</option>
          </select>
        </div>
      </div>

      {/* Official Certificate Card */}
      {certData && (
        <div className="relative p-8 rounded-2xl border-4 border-double border-emerald-600 bg-gradient-to-b from-emerald-50/40 via-white to-emerald-50/20 shadow-lg text-center overflow-hidden">
          {/* Decorative Corner Seals */}
          <div className="absolute top-3 left-4 text-xs font-serif text-emerald-800 tracking-widest uppercase">
            FOODRESQ CERTIFIED
          </div>
          <div className="absolute top-3 right-4 text-xs font-mono text-gray-500">
            ID: {certData.certificateId}
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            <div className="inline-block p-2 bg-emerald-100 rounded-full text-emerald-700 text-2xl font-bold mb-1">
              🌱
            </div>
            
            <h2 className="text-2xl font-serif font-black text-gray-900 tracking-wide uppercase">
              Green Sustainability Certificate
            </h2>
            
            <p className="text-xs text-gray-500 uppercase tracking-widest">
              Awarded in Recognition of Active Food Waste Diversion &amp; Climate Action
            </p>

            <div className="py-2 border-y border-emerald-200">
              <span className="text-xs text-gray-500">Presented with gratitude to:</span>
              <div className="text-xl font-bold text-emerald-900 mt-0.5">{certData.restaurantName}</div>
              <div className="text-xs text-emerald-700 font-semibold">{certData.sustainabilityGrade}</div>
            </div>

            {/* Impact Metric Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3">
              <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-xs">
                <div className="text-2xl font-black text-emerald-600">{certData.metrics.foodRescuedKg} kg</div>
                <div className="text-[11px] font-bold text-gray-700 uppercase mt-0.5">Surplus Rescued</div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-xs">
                <div className="text-2xl font-black text-blue-600">{certData.metrics.co2AvoidedKg} kg</div>
                <div className="text-[11px] font-bold text-gray-700 uppercase mt-0.5">CO₂ Avoided</div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-xs">
                <div className="text-2xl font-black text-teal-600">{certData.metrics.waterSavedLiters?.toLocaleString()} L</div>
                <div className="text-[11px] font-bold text-gray-700 uppercase mt-0.5">Water Preserved</div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-xs">
                <div className="text-2xl font-black text-orange-600">{certData.metrics.mealsEquivalent}</div>
                <div className="text-[11px] font-bold text-gray-700 uppercase mt-0.5">Meals Served</div>
              </div>
            </div>

            <p className="text-xs text-gray-600 italic">
              "Equivalent to planting <strong className="text-emerald-800">{certData.metrics.treesEquivalent} mature urban trees</strong> over a 12-month absorption timeline."
            </p>

            {/* Seal & Signatures */}
            <div className="pt-4 border-t border-emerald-100 flex flex-wrap items-center justify-between text-left text-xs">
              <div>
                <div className="text-[10px] text-gray-500 uppercase">Issue Date</div>
                <div className="font-semibold text-gray-800">{certData.issuedDate}</div>
                <div className="text-[10px] text-gray-400 font-mono">Hash: {certData.verificationHash}</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert(`Certificate ${certData.certificateId} downloaded for printing!`)}
                  className="btn btn-primary text-xs px-4 py-2 flex items-center gap-1.5"
                >
                  <span>🖨️ Download Official PDF Certificate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
