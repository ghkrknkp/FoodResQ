import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import VisionAssistant from '../../components/ai/VisionAssistant';
import VoiceAssistant from '../../components/ai/VoiceAssistant';
import DynamicExpiryCalculator from '../../components/ai/DynamicExpiryCalculator';
import NgoMatcherDispatcher from '../../components/ai/NgoMatcherDispatcher';
import FoodSafetyGuard from '../../components/ai/FoodSafetyGuard';
import EsgCertificateGenerator from '../../components/ai/EsgCertificateGenerator';
import WastePreventionAdvisor from '../../components/ai/WastePreventionAdvisor';
import DemandInsights from '../../components/ai/DemandInsights';
import { Link, useNavigate } from 'react-router-dom';

const TABS = [
  { id: 'vision', label: '📸 Snap-to-Donate', sub: 'Vision AI 2.0', color: 'emerald' },
  { id: 'voice', label: '🗣️ தமிழ் Voice AI', sub: 'Speech NLP', color: 'orange' },
  { id: 'expiry', label: '⏱️ Dynamic Expiry', sub: 'Climate Thermal Engine', color: 'red' },
  { id: 'matcher', label: '🎯 NGO Matchmaker', sub: 'Route Optimizer', color: 'blue' },
  { id: 'safety', label: '🛡️ Safety Guard', sub: 'Digital QR Pass', color: 'teal' },
  { id: 'esg', label: '📜 ESG & Carbon', sub: 'Green Certificates', color: 'green' },
  { id: 'waste', label: '🔮 Waste Prevention', sub: 'Kitchen Forecasting', color: 'purple' },
  { id: 'demand', label: '📊 Demand Insights', sub: 'Historical Trends', color: 'indigo' },
];

export default function AiInnovationHub() {
  const [activeTab, setActiveTab] = useState('vision');
  const navigate = useNavigate();

  const handleApplyToCreateListing = (prefillData) => {
    // Navigate to create listing with state prefilled
    navigate('/restaurant/create-listing', { state: { aiPrefill: prefillData } });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-gray-900 via-primary-950 to-emerald-950 text-white p-8 sm:p-10 mb-8 overflow-hidden shadow-xl border border-gray-800">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
              <span>⚡</span>
              <span>Next-Gen Food Rescue Intelligence</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
              FoodResQ <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">AI Innovation Hub</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-6">
              Explore 7 cutting-edge AI engines engineered to accelerate surplus food redistribution across Tamil Nadu — from multimodal vision recognition and regional Tamil speech parsing to climate-aware microbiological thermal tracking.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/restaurant/create-listing"
                className="btn btn-primary px-5 py-2.5 text-xs font-bold shadow-lg shadow-emerald-900/40"
              >
                + Create Food Listing with AI
              </Link>
              <Link
                to="/browse"
                className="btn bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-2.5 text-xs font-bold transition-all"
              >
                Browse Live Food Listings
              </Link>
            </div>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-10 bottom-4 opacity-15 text-9xl select-none pointer-events-none">
            🤖
          </div>
        </div>

        {/* Quick Highlights Metric Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <div className="text-2xl font-black text-emerald-600">7 Active</div>
            <div className="text-xs font-bold text-gray-800 mt-0.5">Proprietary AI Engines</div>
            <div className="text-[11px] text-gray-500">Vision, Voice, Thermal &amp; Routes</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <div className="text-2xl font-black text-orange-600">தமிழ் + EN</div>
            <div className="text-xs font-bold text-gray-800 mt-0.5">Bilingual Voice Parsing</div>
            <div className="text-[11px] text-gray-500">Zero typing for local chefs</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <div className="text-2xl font-black text-red-600">Live Thermal</div>
            <div className="text-xs font-bold text-gray-800 mt-0.5">Decay Micro-Biology</div>
            <div className="text-[11px] text-gray-500">Weather-calibrated expiry</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <div className="text-2xl font-black text-blue-600">0% Waste</div>
            <div className="text-xs font-bold text-gray-800 mt-0.5">Multi-Stop Dispatching</div>
            <div className="text-[11px] text-gray-500">Auto capacity balancing</div>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-2 mb-8">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-left flex flex-col ${
                  activeTab === tab.id
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-medium ${
                    activeTab === tab.id ? 'text-gray-300' : 'text-gray-400'
                  }`}
                >
                  {tab.sub}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Tab View */}
        <div className="space-y-6">
          {activeTab === 'vision' && (
            <VisionAssistant onApplyToForm={handleApplyToCreateListing} />
          )}

          {activeTab === 'voice' && (
            <VoiceAssistant onApplyToForm={handleApplyToCreateListing} />
          )}

          {activeTab === 'expiry' && (
            <DynamicExpiryCalculator />
          )}

          {activeTab === 'matcher' && (
            <NgoMatcherDispatcher />
          )}

          {activeTab === 'safety' && (
            <FoodSafetyGuard />
          )}

          {activeTab === 'esg' && (
            <EsgCertificateGenerator />
          )}

          {activeTab === 'waste' && (
            <WastePreventionAdvisor />
          )}

          {activeTab === 'demand' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Historical Demand Patterns &amp; AI Recommendations
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Aggregated insights from historical claims and listings to guide optimal restaurant listing times.
                </p>
                <DemandInsights />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
