import { useState } from 'react';

export default function ThreatIntel() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [queryCount, setQueryCount] = useState(0);

  const TIME_SAVED_PER_QUERY_MIN = 10;

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
      const output = data.result || data.response || '🧠 No data found.';
      setResult(output);
      setQueryCount(prev => prev + 1);
    } catch (error) {
      console.error("Fetch error:", error);
      setResult('❌ Could not fetch threat intel.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>🕵️‍♂️ Threat Intelligence (debug v11)</h2>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="e.g. Lazarus Group"
        style={{ width: '300px', marginRight: '10px', padding: '8px' }}
      />
      <button onClick={handleThreatIntelSubmit} style={{ padding: '8px 12px' }}>
        Submit
      </button>

      {loading && <p style={{ marginTop: '1rem' }}>Loading...</p>}

      {!loading && queryCount > 0 && (
        <>
          <p style={{ color: 'green', marginTop: '1rem' }}>
            ⏱️ Estimated Time Saved: ~{TIME_SAVED_PER_QUERY_MIN} min
          </p>
          <p style={{ color: 'black' }}>
            📈 Total Time Saved: {(queryCount * TIME_SAVED_PER_QUERY_MIN).toFixed(1)} minutes
          </p>
        </>
      )}

      {!loading && result && (
        <pre style={{ whiteSpace: 'pre-wrap', background: '#f0f0f0', padding: '1rem', marginTop: '1rem' }}>
          {result}
        </pre>
      )}
    </div>
  );
}
