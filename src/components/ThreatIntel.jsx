import { useState } from 'react';

export default function ThreatIntel() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleThreatIntelSubmit = async () => {
    if (!input.trim()) {
      setResult('⚠️ Please enter a keyword.');
      return;
    }

    console.log("🟢 Submitting:", input);

    try {
      const res = await fetch('https://third-space-backend.onrender.com/api/threat-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input }),
      });

      const text = await res.text(); // read raw response
      console.log("📦 Raw backend response:", text);

      if (!res.ok) {
        setResult(`❌ Server error (${res.status}): ${text}`);
        return;
      }

      const data = JSON.parse(text);

      if (!data.response) {
        setResult('❌ No response key in backend result.');
        return;
      }

      setResult(`🧠 Threat Intel:\n\n${data.response}`);
    } catch (error) {
      console.error("❌ Fetch failed:", error);
      setResult('❌ Could not fetch threat intel.');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>🕵️‍♂️ Threat Intelligence</h2>

      <input
        type="text"
        value={input}
        onChange={(e) => {
          console.log("✍️ Typing:", e.target.value);
          setInput(e.target.value);
        }}
        placeholder="e.g. Malware, APT29"
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
