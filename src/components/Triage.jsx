import { useState } from 'react';

export default function Triage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleTriageSubmit = async () => {
    if (!input.trim()) {
      setResult('⚠️ Please enter an alert to analyze.');
      return;
    }

    try {
      const res = await fetch('https://third-space-backend.onrender.com/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alert: input }),
      });

      const data = await res.json();
      setResult(data.result || '❌ No analysis returned.');
    } catch (error) {
      console.error("Triage fetch error:", error);
      setResult('❌ Error analyzing alert.');
    }
  };

  const handleDemoAlert = () => {
    setInput('Unusual outbound traffic to rare domain');
    setResult('');
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>🚨 Triage</h2>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="e.g. Suspicious login from foreign IP"
        style={{ width: '300px', marginRight: '10px' }}
      />
      <button onClick={handleTriageSubmit}>Submit</button>
      <button onClick={handleDemoAlert} style={{ marginLeft: '10px' }}>
        Load Demo Alert
      </button>

      <div style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
        <strong>🔍 Result:</strong>
        <p>{result}</p>
        {result && (
          <p style={{ fontSize: '0.85em', color: 'gray' }}>
            💡 AI-generated first pass — use with analyst validation.
          </p>
        )}
      </div>
    </div>
  );
}
