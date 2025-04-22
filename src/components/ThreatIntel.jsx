import { useState } from 'react';

export default function ThreatIntel() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleThreatIntelSubmit = async () => {
    if (!query.trim()) {
      setResult('⚠️ Please enter a keyword.');
      return;
    }

    setLoading(true);
    setResult('');

    try {
      const res = await fetch('https://third-space-backend.onrender.com/api/threat-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Backend returned error:", res.status, errorText);
        setResult(`❌ Error ${res.status}: ${errorText}`);
        setLoading(false);
        return;
      }

      const data = await res.json();
      console.log("Backend response:", data);
      setResult(`🧠 Threat Intel:\n\n${data.response}`);
    } catch (error) {
      console.error("Fetch error:", error);
      setResult('❌ Could not fetch threat intel. Check your connection or backend.');
    } finally {
      setLoading(false);
      setQuery('');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>🕵️‍♂️ Threat Intelligence</h2>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g. Malware, APT29, Cobalt Strike"
        style={{ width: '300px', marginRight: '10px' }}
      />

      <button onClick={handleThreatIntelSubmit} disabled={loading}>
        {loading ? 'Analyzing...' : 'Submit'}
      </button>

      <div style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
        <strong>Result:</strong>
        <p>{result}</p>
      </div>
    </div>
  );
}
