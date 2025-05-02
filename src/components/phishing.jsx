import React, { useState } from 'react';

const PhishingDetection = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheckPhishing = async () => {
    if (!text.trim()) {
      alert('Please enter some text');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://third-space-backend.onrender.com/api/phishing-detect/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });

      const data = await response.json();

      const lines = data.result.split('\n').filter(Boolean);
      const lowerResult = data.result.toLowerCase();

      const parsed = {
        suspicious:
          lowerResult.includes('suspicious: yes') ||
          lowerResult.includes('phishing') ||
          lowerResult.includes('fake') ||
          lowerResult.includes('not a legitimate') ||
          lowerResult.includes('red flag') ||
          lowerResult.includes('trick users')
            ? 'Yes 🚨'
            : 'No ✅',
        confidence: lines.find(line => line.toLowerCase().includes('confidence'))?.split(':')[1]?.trim(),
        reason: lines.find(line => line.toLowerCase().includes('reason'))?.split(':')[1]?.trim() || lines.slice(1).join(' ')
      };

      setResult(parsed);
    } catch (error) {
      console.error('Error checking phishing:', error);
      alert('Error checking phishing link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
        🛡️ AI-Powered Phishing Detection
      </h2>

      <textarea
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
        placeholder="Paste email or suspicious text here..."
        rows="5"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div>
        <button
          className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 transition disabled:opacity-50"
          onClick={handleCheckPhishing}
          disabled={loading}
        >
          {!loading && (
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 12a4 4 0 01-8 0m8 0a4 4 0 01-8 0m8 0V8a4 4 0 00-8 0v4m8 0v4a4 4 0 01-8 0v-4"
              />
            </svg>
          )}
          {loading ? 'Checking...' : 'Check for Phishing'}
        </button>
      </div>

      {result && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-300 rounded-md space-y-2">
          <h3 className="text-lg font-medium text-gray-700">🔍 Result</h3>
          <p><strong>Suspicious:</strong> {result.suspicious}</p>
          <p><strong>Confidence:</strong> {result.confidence || 'N/A'}</p>
          <p><strong>Reason:</strong> {result.reason || 'N/A'}</p>
        </div>
      )}
    </div>
  );
};

export default PhishingDetection;
