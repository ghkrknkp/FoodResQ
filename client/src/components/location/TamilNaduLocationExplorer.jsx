import React from 'react';

const TN_CITIES = [
  { id: 'Namakkal', name: 'Namakkal', icon: '📍' },
  { id: 'Chennai', name: 'Chennai', icon: '🏛️' },
  { id: 'Coimbatore', name: 'Coimbatore', icon: '🌿' },
  { id: 'Madurai', name: 'Madurai', icon: '🛕' },
  { id: 'Trichy', name: 'Trichy', icon: '🏰' },
  { id: 'Salem', name: 'Salem', icon: '🥭' },
  { id: 'Thanjavur', name: 'Thanjavur', icon: '🌾' },
  { id: 'Tirunelveli', name: 'Tirunelveli', icon: '🌴' },
  { id: 'Erode', name: 'Erode', icon: '🧵' },
  { id: 'Vellore', name: 'Vellore', icon: '🏯' }
];

export default function TamilNaduLocationExplorer({ selectedLocation, onSelectLocation, onSelectCategory }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-8">
      {/* 3 Step Guide Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 pb-5 border-b border-gray-100">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-50/70 border border-orange-100">
          <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
            1
          </div>
          <div>
            <div className="text-xs font-bold text-gray-900">Choose City / District</div>
            <div className="text-[11px] text-gray-500">Select your nearest Tamil Nadu city</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50/70 border border-emerald-100">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
            2
          </div>
          <div>
            <div className="text-xs font-bold text-gray-900">Browse Available Food</div>
            <div className="text-[11px] text-gray-500">Meals, Idli, Dosa, Biryani &amp; more</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50/70 border border-blue-100">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
            3
          </div>
          <div>
            <div className="text-xs font-bold text-gray-900">Claim &amp; Collect</div>
            <div className="text-[11px] text-gray-500">Pick up from restaurants for donation</div>
          </div>
        </div>
      </div>

      {/* City Filter Pills */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
            <span>📍</span>
            <span>Popular Cities:</span>
            {selectedLocation && (
              <span className="text-xs bg-orange-100 text-orange-800 font-medium px-2 py-0.5 rounded-full ml-1">
                Selected: {selectedLocation}
              </span>
            )}
          </div>
          {selectedLocation && (
            <button
              onClick={() => onSelectLocation('')}
              className="text-xs text-orange-600 hover:text-orange-700 font-medium"
            >
              Clear filter
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onSelectLocation('')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              !selectedLocation
                ? 'bg-gray-900 text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Cities
          </button>
          {TN_CITIES.map((city) => {
            const isSelected = selectedLocation && selectedLocation.toLowerCase().includes(city.id.toLowerCase());
            return (
              <button
                key={city.id}
                type="button"
                onClick={() => onSelectLocation(isSelected ? '' : city.id)}
                className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-orange-600 text-white shadow-xs ring-2 ring-orange-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{city.icon}</span>
                <span>{city.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
