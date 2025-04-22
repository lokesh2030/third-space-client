import { useState } from 'react';

export default function ThreatIntel() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleThreatIntelSubmit = async () => {
    console.log("Input value:", input); // for debug

    try {
      const res = await fetch('https://third-space-backend.onrender.com/api/threat-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input }),
      });

      const data = await res.json();
      console.log("Backend response:", data); // for debug
      setResult(`🧠 Threat Intel: ${data.response}`);
      setInput('');
    } catch (error) {
      console.error("ERROR during fetch:", error);
      setResult('❌ Error: Could not fetch threat intelligence.');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>🕵️‍♂️ Threat Intelligence</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="e.g. Malware, Cobalt Strike, APT28"
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
