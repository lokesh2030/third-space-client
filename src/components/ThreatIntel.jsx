import { useState } from 'react';

export default function ThreatIntel() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleThreatIntelSubmit = async () => {
    try {
      const res = await fetch('https://third-space-backend.onrender.com/api/threat-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: input }), // original version
      });

      const data = await res.json();
      setResult(data.result || data.response || '🧠 No data found.');
    } catch (error) {
      console.error("Fetch error:", error);
      setResult('❌ Could not fetch threat intel.');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>🕵️‍♂️ Threat Intelligence</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="e.g. Malware, Cobalt Strike"
        style={{ width: '300px', marginRight: '10px' }}
      />
      <button onClick={handleThreatIntelSubmit}>Submit</button>
      <div style={{ marginTop: '1rem' }}>
        <strong>Result:</strong>
        <p>{result}</p>
      </div>
    </div>
  );
}
