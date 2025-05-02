import React, { useState } from 'react';

export default function PhishingDetection() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheckPhishing = async () => {
    if (!text.trim()) {
      setResult({ error: '⚠️ Please enter some text to analyze.' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://third-space-backend.onrender.com/api/phishing-detect/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
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
      console.error('Phishing check error:', error);
      setResult({ error: '❌ Something went wrong while checking for phishing.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">🎣 Phishing Detection</h2>

      <textarea
        className="w-full resize-none rounded-md border border-gray-300 bg-white p-4 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        placeholder="Paste suspicious email content or link here..."
        rows={5}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex justify-end">
        <button
          onClick={handleCheckPhishing}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Check for Phishing'}
        </button>
      </div>

      {result && (
        <div className="mt-4 rounded-md border border-gray-300 bg-gray-50 p-4 space-y-2 text-sm">
          <h3 className="text-base font-medium text-gray-700">🔍 Result</h3>
          {result.error ? (
            <p className="text-red-600">{result.error}</p>
          ) : (
            <>
              <p><strong>Suspicious:</strong> {result.suspicious}</p>
              <p><strong>Confidence:</strong> {result.confidence || 'N/A'}</p>
              <p><strong>Reason:</strong> {result.reason || 'N/A'}</p>
              <p className="text-gray-500 text-xs">
                💡 AI-generated analysis — always verify with a human analyst.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
