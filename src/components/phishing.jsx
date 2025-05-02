import React, { useState } from 'react';

export default function PhishingDetection() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheckPhishing = async () => {
    if (!text.trim()) {
      setResult('⚠️ Please enter text to check.');
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
      console.error("Phishing check error:", error);
      setResult({ error: '❌ Error checking phishing link.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoText = () => {
    setText('Received a login link from http://secure-login.tk');
    setResult(null);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>🎣 Phishing Detection</h2>

      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste suspicious message or link here"
        style={{ width: '300px', marginRight: '10px' }}
      />

      <button onClick={handleCheckPhishing} disabled={loading}>
        {loading ? 'Checking...' : 'Check for Phishing'}
      </button>

      <button onClick={handleDemoText} style={{ marginLeft: '10px' }}>
        Load Demo
      </button>

      <div style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
        {result && (
          <>
            <strong>🔍 Result:</strong>
            <p><strong>Suspicious:</strong> {result.suspicious || result.error}</p>
            <p><strong>Confidence:</strong> {result.confidence || 'N/A'}</p>
            <p><strong>Reason:</strong> {result.reason || 'N/A'}</p>
            <p style={{ fontSize: '0.85em', color: 'gray' }}>
              💡 AI-generated — always verify with an analyst.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
