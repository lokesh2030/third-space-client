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
      const response = await fetch('https://third-space-backend.onrender.com/api/phishing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error checking phishing:', error);
      alert('Error checking phishing link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Phishing Link Detection</h2>

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
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Result:</h3>
          <p>Suspicious: {result.suspicious ? 'Yes 🚨' : 'No ✅'}</p>
          <p>Reason: {result.reason}</p>

          <div className="mt-3">
            <h4 className="font-semibold">Extracted URLs:</h4>
            <ul className="list-disc list-inside">
              {result.urls.map((url, index) => (
                <li key={index}>{url}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhishingDetection;
