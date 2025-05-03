import { useState } from 'react';
import ThreatIntelDisplay from '../components/ThreatIntelDisplay';

export default function ThreatIntel() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeSavedMsg, setTimeSavedMsg] = useState('');
  const [queryCount, setQueryCount] = useState(0);

  const TIME_SAVED_PER_QUERY_MIN = 10;

  const handleThreatIntelSubmit = async () => {
    if (!input.trim()) {
      setResult('❌ Please enter a valid threat actor or malware name.');
      return;
    }

    setLoading(true);
    setCopied(false);
    setTimeSavedMsg('');
    const start = Date.now();

    try {
      const res = await fetch('https://third-space-backend.onrender.com/api/threat-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: input }),
      });

      const data = await res.json();
      const output = data.result || data.response || '🧠 No data found.';
      setResult(output);

      const durationMs = Date.now() - start;
      const baselineMs = 7 * 60 * 1000;
      const savedMs = Math.max(0, baselineMs - durationMs);
      const savedMin = (savedMs / 60000).toFixed(1);
      const percentFaster = ((savedMs / baselineMs) * 100).toFixed(1);

      setTimeSavedMsg(`⏱️ Saved ~${savedMin} min • 🚀 ${percentFaster}% faster than manual research`);
      setQueryCount(prev => prev + 1);
    } catch (error) {
      console.error("Fetch error:", error);
      setResult('❌ Could not fetch threat intel.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalTimeSavedMin = (queryCount * TIME_SAVED_PER_QUERY_MIN).toFixed(1);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>🕵️‍♂️ Threat Intelligence</h2>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="e.g. Lazarus Group, Emotet"
        style={{ width: '300px', marginRight: '10px', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
      />
      <button onClick={handleThreatIntelSubmit} style={{ padding: '8px 12px' }}>
        Submit
      </button>

      <div style={{ marginTop: '1.5rem' }}>
        {loading && <p>🔄 Fetching threat intelligence, please wait...</p>}

        {!loading && timeSavedMsg && (
          <p style={{ fontSize: "0.85em", color: "#10b981", marginTop: "1rem" }}>
            {timeSavedMsg}
          </p>
        )}

        {!loading && queryCount > 0 && (
          <div style={{ marginTop: "0.5rem", backgroundColor: "#f3f4f6", padding: "1rem", borderRadius: "8px" }}>
            <p style={{ fontWeight: "bold" }}>📈 Total Time Saved: {totalTimeSavedMin} minutes</p>
            <p style={{ fontSize: "0.85em", color: "#6b7280" }}>
              ({queryCount} lookups × {TIME_SAVED_PER_QUERY_MIN} min each)
            </p>
          </div>
        )}

        {!loading && result && (
          <div style={{ marginTop: '1rem' }}>
            <div style={{ marginBottom: '10px' }}>
              <button onClick={handleCopy} style={{ padding: '8px 12px', cursor: 'pointer' }}>
                {copied ? '✅ Copied!' : '📋 Copy to Clipboard'}
              </button>
            </div>

            <ThreatIntelDisplay key={queryCount} aiResponse={result} />
          </div>
        )}
      </div>
    </div>
  );
}
