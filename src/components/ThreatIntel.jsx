import { useState } from 'react';

export default function ThreatIntel() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleThreatIntelSubmit = async () => {
    if (!input.trim()) {
      setResult('⚠️ Please enter a keyword.');
      return;
    }

    console.log("🔍 Submitting keyword:", input); // Debug

    try {
      const res = await fetch('https://third-space-backend.onrender.com/api/threat-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input }), // ✅ Send key "query"
      });

      const data = await res.json();
      console.log("✅ Backend response:", data); // Debug

      setResult(`🧠 Threat Intel:\n\n${data.response}`);
    } catch (error) {
      console.error("❌ Error fetching threat intel:", error);
      setResult('❌ Could not fetch threat intel.');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>🕵️‍♂️ Threat Intelligence</h2>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)} // ✅ Hook into input
        placeholder="e.g. Cobalt Strike, APT29, Ransomware"
        style={{ width: '300px', marginRight: '10px' }}
      />
      <button onClick={handleThreatIntelSubmit}>Submit</button>

      <div style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
        <strong>Result:</strong>
        <p>{result}</p>
      </div>
    </div>
  );
}
