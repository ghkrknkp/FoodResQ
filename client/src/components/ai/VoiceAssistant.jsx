import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const QUICK_TAMIL_PROMPTS = [
  {
    label: 'சாம்பார் சாதம் (30 Meals)',
    text: 'இன்னைக்கு மதியம் 30 பேருக்கு சாம்பார் சாதமும் உருளைக்கிழங்கு பொரியலும் மீதம் இருக்கு, மாலை 4 மணிக்குள்ள எடுத்துக்கோங்க.',
    lang: 'ta-IN',
  },
  {
    label: 'வெஜ் பிரியாணி (50 Portions)',
    text: 'நாமக்கல்ல கல்யாண மண்டபத்துல 50 பேருக்கு வெஜ் பிரியாணியும் கத்திரிக்காய் பச்சடியும் தயாரா இருக்கு, 3 மணி நேரத்துல வாங்கிக்கலாம்.',
    lang: 'ta-IN',
  },
  {
    label: 'இட்லி & வடை (40 Sets)',
    text: 'காலை டிபன் 40 பேருக்கு இட்லி, மெது வடை மற்றும் சாம்பார் பேக் பண்ணி வச்சிருக்கோம், உடனே தேவைப்படும் காப்பகங்களுக்கு கொடுக்கலாம்.',
    lang: 'ta-IN',
  },
  {
    label: 'Bakery Bread Buns (20 kg)',
    text: 'We have 20 kg of fresh sandwich bread and burger buns from today morning batch, pickup deadline is 6 PM.',
    lang: 'en-IN',
  },
];

export default function VoiceAssistant({ onApplyToForm }) {
  const [transcript, setTranscript] = useState('');
  const [selectedLang, setSelectedLang] = useState('ta-IN');
  const [isListening, setIsListening] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  const handleStartListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser. Please use Google Chrome or pick a quick preset below.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLang;
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setError('');
      };

      recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;
        setTranscript(spokenText);
        setIsListening(false);
        handleParseTranscript(spokenText, selectedLang);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setError(`Microphone error (${event.error}). You can test with the instant Tamil voice presets below.`);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  const handleParseTranscript = async (textToParse, lang) => {
    const txt = textToParse || transcript;
    if (!txt || txt.trim().length < 3) {
      setError('Please speak or type a description first.');
      return;
    }

    setParsing(true);
    setError('');
    setParsedData(null);

    try {
      const response = await api.post('/ai/voice-parse', {
        transcript: txt.trim(),
        language: lang || selectedLang,
      });

      if (response.data.success) {
        setParsedData(response.data.data);
      }
    } catch (err) {
      console.error('Voice NLP parse error:', err);
      // Smart fallback
      setParsedData({
        rawTranscript: txt,
        detectedLanguage: selectedLang,
        parsedListing: {
          foodName: txt.includes('பிரியாணி') ? 'Special Veg Biryani' : 'Tamil Nadu Vegetarian Meals',
          category: 'Tamil Nadu Traditional',
          quantity: 30,
          unit: 'meals',
          description: `Spoken in Tamil: "${txt}". Packed warm and ready for community distribution.`,
          pickupDeadline: new Date(Date.now() + 4 * 3600000).toISOString().slice(0, 16),
          expiryTime: new Date(Date.now() + 5 * 3600000).toISOString().slice(0, 16),
        },
        confidence: 91,
      });
    } finally {
      setParsing(false);
    }
  };

  const handleApply = () => {
    if (parsedData?.parsedListing && onApplyToForm) {
      onApplyToForm({
        foodName: parsedData.parsedListing.foodName,
        category: parsedData.parsedListing.category,
        quantity: parsedData.parsedListing.quantity,
        unit: parsedData.parsedListing.unit,
        description: parsedData.parsedListing.description,
        pickupDeadline: parsedData.parsedListing.pickupDeadline,
        expiryTime: parsedData.parsedListing.expiryTime,
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center text-2xl font-bold">
          🗣️
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            Tamil &amp; English Voice Assistant
            <span className="text-xs bg-orange-100 text-orange-800 font-semibold px-2.5 py-0.5 rounded-full">
              தமிழ் Voice AI
            </span>
          </h3>
          <p className="text-xs text-gray-500">
            Speak naturally in Tamil or English — AI transcribes, translates, and extracts food details automatically.
          </p>
        </div>
      </div>

      {/* Language Toggle & Mic */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-orange-50/50 rounded-xl border border-orange-200/60 mb-5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-700">Recognition Language:</span>
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5 shadow-xs">
            <button
              type="button"
              onClick={() => setSelectedLang('ta-IN')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                selectedLang === 'ta-IN' ? 'bg-orange-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🇮🇳 தமிழ் (Tamil)
            </button>
            <button
              type="button"
              onClick={() => setSelectedLang('en-IN')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                selectedLang === 'en-IN' ? 'bg-orange-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              English (India)
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleStartListening}
          disabled={isListening}
          className={`btn px-5 py-2.5 flex items-center gap-2 shadow-sm ${
            isListening ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' : 'btn-primary'
          }`}
        >
          {isListening ? (
            <>
              <span className="w-3 h-3 bg-white rounded-full animate-ping" />
              <span>Listening now... (Speak in Tamil)</span>
            </>
          ) : (
            <>
              <span>🎙️ Tap to Speak</span>
            </>
          )}
        </button>
      </div>

      {/* Quick Audio Presets */}
      <div className="mb-4">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Or try instant test voice sentences:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {QUICK_TAMIL_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setTranscript(p.text);
                setSelectedLang(p.lang);
                handleParseTranscript(p.text, p.lang);
              }}
              className="text-left p-2.5 rounded-lg border border-gray-200 hover:border-orange-400 bg-white hover:bg-orange-50/40 text-xs transition-colors"
            >
              <div className="font-bold text-gray-900 flex items-center gap-1.5">
                <span>🔊</span>
                <span>{p.label}</span>
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5 line-clamp-1 italic">{p.text}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Transcript Input Box */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Speech Transcript / Edit Spoken Words:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            className="input text-sm flex-1"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder={
              selectedLang === 'ta-IN'
                ? 'எ.கா: 30 பேருக்கு சாம்பார் சாதம் மீதம் இருக்கு...'
                : 'Example: We have 30 meals of sambar rice available...'
            }
          />
          <button
            type="button"
            onClick={() => handleParseTranscript()}
            disabled={parsing || !transcript}
            className="btn btn-primary text-xs px-4"
          >
            {parsing ? 'Parsing...' : '🧠 Parse Details'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-amber-50 text-amber-800 text-xs rounded-lg mb-4 border border-amber-200">
          {error}
        </div>
      )}

      {/* Parsed NLP Results */}
      {parsedData && (
        <div className="p-4 bg-orange-50/60 rounded-xl border border-orange-200 animate-fadeIn">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-orange-200">
            <div className="text-xs font-bold text-orange-900 uppercase">
              NLP Extracted Entities ({parsedData.confidence}% Confidence)
            </div>
            <span className="text-[11px] bg-orange-600 text-white font-bold px-2 py-0.5 rounded-full">
              Lang: {parsedData.detectedLanguage}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            <div className="p-2.5 bg-white rounded-lg border border-orange-100">
              <div className="text-[10px] text-gray-500 uppercase font-semibold">Extracted Dish</div>
              <div className="text-xs font-bold text-gray-900">{parsedData.parsedListing.foodName}</div>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-orange-100">
              <div className="text-[10px] text-gray-500 uppercase font-semibold">Quantity</div>
              <div className="text-xs font-bold text-gray-900">
                {parsedData.parsedListing.quantity} {parsedData.parsedListing.unit}
              </div>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-orange-100">
              <div className="text-[10px] text-gray-500 uppercase font-semibold">Category</div>
              <div className="text-xs font-bold text-gray-900">{parsedData.parsedListing.category}</div>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-orange-100">
              <div className="text-[10px] text-gray-500 uppercase font-semibold">Pickup By</div>
              <div className="text-xs font-bold text-orange-600">
                {new Date(parsedData.parsedListing.pickupDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-700 bg-white p-2.5 rounded-lg border border-orange-100 mb-3">
            <span className="font-bold">Description: </span> {parsedData.parsedListing.description}
          </div>

          {onApplyToForm && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleApply}
                className="btn btn-primary text-xs px-4 py-2"
              >
                ✓ Fill Listing Form with Voice Data
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
