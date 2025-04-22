import { useState } from 'react';

export default function ThreatIntel() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleThreatIntelSubmit = async () => {
    try {
      const res = await fetch('https://third-space-backend.onrender.com/api/threat-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input }), // ✅ must match backend key
      });

      const data = await res.json();
      setResult(`🧠 Threat Intel: ${data.response}`);
    } catch (error) {
      setResult('❌ Error: Could not fetch threat intelligence.');
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>🕵️‍♂️ Threat Intelligence</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="e.g. Cobalt Strike, APT28, ransomware"
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
