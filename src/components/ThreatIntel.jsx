import { useState } from 'react';
import ThreatIntelDisplay from '../components/ThreatIntelDisplay';

export default function ThreatIntel() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [queryCount, setQueryCount] = useState(0);

  const TIME_SAVED_PER_QUERY_MIN = 10;

  const handleThreatIntelSubmit = async () => {
    if (!input.trim()) {
      setResult('❌ Please enter a valid threat actor or malware name.');
      return;
    }

    setLoading(true);
    setCopied(false);

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

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalTimeSavedMin = (queryCount * TIME_SAVED_PER_QUERY_MIN).toFixed(1);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>🕵️‍♂️ Threat Intelligence (v10)</h2>

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

      {loading && (
        <p style={{ marginTop: '1.5rem' }}>🔄 Fetching threat intelligence, please wait...</p>
      )}

      {!loading && result && (
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ marginBottom: '10px' }}>
            <button onClick={handleCopy} style={{ padding: '8px 12px', cursor: 'pointer' }}>
              {copied ? '✅ Copied!' : '📋 Copy to Clipboard'}
            </button>
          </div>

          <div style={{ backgroundColor: "#f9fafb", padding: "1rem", borderRadius: "8px" }}>
            {/* ⏱️ Estimated Time Saved */}
            <p style={{ fontSize: "0.85em", color: "#10b981", marginBottom: "0.5rem" }}>
              ⏱️ Estimated Time Saved: ~{TIME_SAVED_PER_QUERY_MIN} min
            </p>

            {/* GPT Result Display */}
            <ThreatIntelDisplay aiResponse={result} />

            {/* 📈 Total Time Saved */}
            <div style={{ marginTop: "1rem", backgroundColor: "#f3f4f6", padding: "1rem", borderRadius: "8px" }}>
              <p style={{ fontWeight: "bold" }}>
                📈 Total Time Saved: {totalTimeSavedMin} minutes
              </p>
              <p style={{ fontSize: "0.85em", color: "#6b7280" }}>
                ({queryCount} lookups × {TIME_SAVED_PER_QUERY_MIN} min each)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
