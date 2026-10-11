import React, { useState } from 'react';
import api from '../../services/api';
import VisionAssistant from './VisionAssistant';
import VoiceAssistant from './VoiceAssistant';

export default function ListingAssistant({ onApplyResult, isLoading: parentLoading }) {
  const [activeMode, setActiveMode] = useState('text'); // 'text' | 'vision' | 'voice'
  const [description, setDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (description.trim().length < 10) {
      setError('Please provide a more detailed description (at least 10 characters)');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await api.post('/ai/listing-assistant', {
        description: description.trim()
      });

      if (response.data.success) {
        setResult(response.data.data);
      }
    } catch (err) {
      console.error('AI Assistant error:', err);
      setError(err.response?.data?.message || 'AI service is temporarily unavailable. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyResult = () => {
    if (result && onApplyResult) {
      onApplyResult(result);
      setDescription('');
      setResult(null);
    }
  };

  const handleClear = () => {
    setDescription('');
    setResult(null);
    setError('');
  };

  return (
    <div className="card mb-6 border-2 border-primary-200 bg-gradient-to-r from-primary-50 via-white to-secondary-50">
      {/* Header & Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-primary-100">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center mr-3 text-white text-lg">
            🤖
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              FoodResQ AI Assistant Suite
              <span className="text-[10px] bg-primary-100 text-primary-800 font-bold px-2 py-0.5 rounded-full uppercase">
                3-in-1
              </span>
            </h3>
            <p className="text-xs text-gray-600">List surplus food with Smart Text, Camera Vision, or Tamil Voice</p>
          </div>
        </div>

        {/* 3 Modes */}
        <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1 shadow-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveMode('text')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'text'
                ? 'bg-primary-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ✍️ Text AI
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('vision')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'vision'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📸 Snap Vision
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('voice')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'voice'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🗣️ தமிழ் Voice
          </button>
        </div>
      </div>

      {/* Mode 1: Text AI Assistant */}
      {activeMode === 'text' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe your surplus food
            </label>
            <textarea
              className="input min-h-[90px] resize-none text-sm"
              placeholder="Example: We have 25 leftover vegetable rice meals from today's lunch service in Namakkal. They're fresh and need to be picked up soon..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading || parentLoading}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500">
                {description.length}/500 characters
              </p>
              <p className="text-xs text-gray-500">
                Minimum 10 characters for AI analysis
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading || parentLoading || description.trim().length < 10}
              className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed text-xs py-2.5"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing with AI...
                </div>
              ) : (
                '✨ Analyze & Generate Suggestions'
              )}
            </button>
            
            {(description || result) && (
              <button
                type="button"
                onClick={handleClear}
                disabled={loading || parentLoading}
                className="btn btn-outline text-xs px-4"
              >
                Clear
              </button>
            )}
          </div>

          {/* AI Results */}
          {result && (
            <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 shadow-xs animate-fadeIn">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-gray-900">AI Analysis Results</h4>
                <span className="badge badge-success text-xs">
                  {result.confidence}% Confidence
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Suggested Title
                  </label>
                  <div className="p-2 bg-gray-50 rounded border text-xs text-gray-900 font-medium">
                    {result.suggestedTitle}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Category
                  </label>
                  <div className="p-2 bg-gray-50 rounded border text-xs text-gray-900 font-medium">
                    {result.category}
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Enhanced Description
                </label>
                <div className="p-2 bg-gray-50 rounded border text-xs text-gray-900">
                  {result.enhancedDescription}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleApplyResult}
                  className="btn btn-primary text-xs px-4 py-2"
                >
                  ✓ Apply Suggestions to Form
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Vision Snap-to-Donate */}
      {activeMode === 'vision' && (
        <VisionAssistant
          onApplyToForm={(visionData) => {
            if (onApplyResult) {
              onApplyResult({
                suggestedTitle: visionData.suggestedTitle,
                category: visionData.category,
                enhancedDescription: visionData.enhancedDescription,
                quantity: visionData.quantity,
                unit: visionData.unit,
                image: visionData.image,
              });
            }
          }}
        />
      )}

      {/* Mode 3: Tamil & English Voice AI */}
      {activeMode === 'voice' && (
        <VoiceAssistant
          onApplyToForm={(voiceData) => {
            if (onApplyResult) {
              onApplyResult({
                suggestedTitle: voiceData.foodName,
                category: voiceData.category,
                enhancedDescription: voiceData.description,
                quantity: voiceData.quantity,
                unit: voiceData.unit,
                pickupDeadline: voiceData.pickupDeadline,
                expiryTime: voiceData.expiryTime,
              });
            }
          }}
        />
      )}
    </div>
  );
}