import { useState } from 'react';

export default function ThreatIntel() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleThreatIntelSubmit = async () => {
    if (!input.trim()) {
      setResult('⚠️ Please enter a keyword.');
      return;
    }

    console.log("✅ User input captured:", input);

    const bodyPayload = JSON.stringify({ query: input });
    console.log("🚀 Payload being sent:", bodyPayload);

    try {
      const res = await fetch('https://third-space-backend.onrender.com/api/threat-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: bodyPayload,
      });

      const responseText = await res.text();
      console.log("📦 Raw backend response:", responseText);

      const data = JSON.parse(responseText);
      if (!data.response) {
        setResult('❌ Invalid response from backend.');
        return;
      }

      setResult(`🧠 Threat Intel:\n\n${data.response}`);
    } catch (error) {
      console.error("❌ Error during fetch:", error);
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
          console.log("✍️ Input changed:", e.target.value);
          setInput(e.target.value);
        }}
        placeholder="e.g. Malware, APT28"
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
