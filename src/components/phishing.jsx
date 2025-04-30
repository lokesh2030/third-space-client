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

      // Parse result from GPT
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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🛡️ AI-Powered Phishing Detection</h2>

      <textarea
        className="w-full p-2 border rounded mb-4"
        placeholder="Paste email or suspicious text here..."
        rows="5"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={handleCheckPhishing}
        disabled={loading}
      >
        {loading ? 'Checking...' : 'Check for Phishing'}
      </button>

      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Result:</h3>
          <p><strong>Suspicious:</strong> {result.suspicious}</p>
          <p><strong>Confidence:</strong> {result.confidence || 'N/A'}</p>
          <p><strong>Reason:</strong> {result.reason || 'N/A'}</p>
        </div>
      )}
    </div>
  );
};

export default PhishingDetection;
