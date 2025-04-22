import { useState } from 'react';

export default function Triage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleTriageSubmit = async () => {
    try {
      const res = await fetch('https://third-space-backend.onrender.com/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alert: input }),
      });

      const data = await res.json();
      setResult(`🔍 Triage Analysis: ${data.response}`);
    } catch (error) {
      setResult('❌ Error: Could not connect to AI backend.');
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>🚨 Triage</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter alert here"
        style={{ width: '300px', marginRight: '10px' }}
      />
      <button onClick={handleTriageSubmit}>Submit</button>
      <div style={{ marginTop: '1rem' }}>
        <strong>Result:</strong>
        <p>{result}</p>
      </div>
    </div>
  );
}

