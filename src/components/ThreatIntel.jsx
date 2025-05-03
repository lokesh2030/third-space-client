import { useState } from 'react';
import ThreatIntelDisplay from '../components/ThreatIntelDisplay';

export default function ThreatIntel() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeSavedMsg, setTimeSavedMsg] = useState('');

  const handleThreatIntelSubmit = async () => {
    if (!input.trim()) {
      setResult('❌ Please enter a valid threat actor or malware name.');
      return;
    }

    setLoading(true);
    setCopied(false);
    setTimeSavedMsg('');
    setResult('');

    const start = Date.now();

    try {
      const res = await fetch('https://third-space-backend.onrender.com/api/threat-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: input }),
      });

      const data = await res.json();
      const durationMs = Date.now() - start;

      const baselineMs = 8 * 60 * 1000; // 8 minutes assumed manual effort
      const savedMs = Math.max(0, baselineMs - durationMs);
      const savedMin = (savedMs / 60000).toFixed(1);
      const percentFaster = ((savedMs / baselineMs) * 100).toFixed(1);

      setTimeSavedMsg(`⏱️ Saved ~${savedMin} min • 🚀 ${percentFaster}% faster than manual research`);
      setResult(data.result || data.response || '🧠 No data found.');
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

  return (
    <div style={{ padding: '1rem' }}>
      <h2>🕵️‍♂️ Threat Intelligence</h2>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="e.g. Lazarus Group, Black Basta"
        style={{ width: '300px', marginRight: '10px' }}
      />
      <button onClick={handleThreatIntelSubmit}>Submit</button>

      <div style={{ marginTop: '1.5rem' }}>
        {loading ? (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <p style={{ fontSize: "18px" }}>🔄 Fetching threat intelligence, please wait...</p>
          </div>
        ) : result ? (
          <>
            <div style={{ marginBottom: '10px' }}>
              <button onClick={handleCopy} style={{ padding: '8px 12px', cursor: 'pointer' }}>
                {copied ? '✅ Copied!' : '📋 Copy to Clipboard'}
              </button>
            </div>
            <ThreatIntelDisplay aiResponse={result} />
            {timeSavedMsg && (
              <p style={{ fontSize: '0.85em', color: '#10b981', marginTop: '0.75rem' }}>{timeSavedMsg}</p>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
