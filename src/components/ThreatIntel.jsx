import { useState } from 'react';

export default function ThreatIntel() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');

  const handleThreatIntelSubmit = async () => {
    console.log("Sending query to backend:", query);

    try {
      const res = await fetch('https://third-space-backend.onrender.com/api/threat-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }), // ✅ must match backend key exactly
      });

      const data = await res.json();
      console.log("Backend returned:", data);
      setResult(`🧠 Threat Intel: ${data.response}`);
      setQuery('');
    } catch (error) {
      console.error("ERROR fetching threat intel:", error);
      setResult('❌ Could not fetch threat intel.');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>🕵️‍♂️ Threat Intelligence</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g. Cobalt Strike, APT28, Ransomware"
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
