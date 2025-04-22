import { useState } from 'react';

export default function ThreatIntel() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [raw, setRaw] = useState('');

  const handleThreatIntelSubmit = async () => {
    if (!query.trim()) {
      setResult('⚠️ Please enter a keyword.');
      return;
    }

    setResult('⏳ Contacting GPT-4...');
    setRaw('');

    try {
      console.log("Sending to backend:", query);

      const res = await fetch('https://third-space-backend.onrender.com/api/threat-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const text = await res.text(); // read full text response
      console.log("Raw backend response:", text);

      setRaw(text); // show raw data just in case

      if (!res.ok) {
        setResult(`❌ Server Error (${res.status})`);
        return;
      }

      const data = JSON.parse(text); // manually parse
      if (!data.response) {
        setResult('❌ Missing expected response key.');
        return;
      }

      setResult(`🧠 Threat Intel:\n\n${data.response}`);
    } catch (error) {
      console.error("Error caught:", error);
      setResult('❌ Could not connect to backend.');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>🕵️‍♂️ Threat Intelligence</h2>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g. Malware, Cobalt Strike"
        style={{ width: '300px', marginRight: '10px' }}
      />

      <button onClick={handleThreatIntelSubmit}>Submit</button>

      <div style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
        <strong>Result:</strong>
        <p>{result}</p>
      </div>

      {raw && (
        <div style={{ marginTop: '1rem', fontSize: '0.9em', color: 'gray' }}>
          <strong>🔍 Raw Response:</strong>
          <pre>{raw}</pre>
        </div>
      )}
    </div>
  );
}
