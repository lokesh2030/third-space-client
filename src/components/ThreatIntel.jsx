import { useState } from 'react';

export default function ThreatIntel() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleThreatIntelSubmit = async () => {
    if (!input.trim()) {
      setResult('⚠️ Please enter a keyword.');
      return;
    }

    console.log("🟢 Submitting query:", input);

    try {
      const res = await fetch('https://third-space-backend.onrender.com/api/threat-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input }), // ✅ fixed: sends `query`
      });

      const text = await res.text();
      console.log("📦 Raw backend response:", text);

      const data = JSON.parse(text);

      if (!data.response) {
        setResult('❌ Unexpected backend response.');
        return;
      }

      setResult(`🧠 Threat Intel:\n\n${data.response}`);
    } catch (error) {
      console.error("❌ Fetch error:", error);
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
        placeholder="e.g. Malware, APT29, Cobalt Strike"
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
