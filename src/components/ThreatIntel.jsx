import { useState } from 'react';
import ThreatIntelDisplay from '../components/ThreatIntelDisplay'; // ✅ Import the display component

export default function ThreatIntel() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false); // ✅ Add loading state

  const handleThreatIntelSubmit = async () => {
    if (!input.trim()) {
      setResult('❌ Please enter a valid threat actor or malware name.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('https://third-space-backend.onrender.com/api/threat-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: input }),
      });

      const data = await res.json();
      setResult(data.result || data.response || '🧠 No data found.');
    } catch (error) {
      console.error("Fetch error:", error);
      setResult('❌ Could not fetch threat intel.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>🕵️‍♂️ Threat Intelligence</h2>
      
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="e.g. Lazarus Group, Cobalt Strike"
        style={{ width: '300px', marginRight: '10px' }}
      />
      <button onClick={handleThreatIntelSubmit}>Submit</button>

      <div style={{ marginTop: '1.5rem' }}>
        {loading ? (
          <p>🔄 Fetching threat intelligence...</p>
        ) : result ? (
          <ThreatIntelDisplay aiResponse={result} />
        ) : null}
      </div>
    </div>
  );
}
