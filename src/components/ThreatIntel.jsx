import { useState } from 'react';
import ThreatIntelDisplay from '../components/ThreatIntelDisplay';

export default function ThreatIntel() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleThreatIntelSubmit = async () => {
    if (!input.trim()) {
      setResult('❌ Please enter a valid threat actor or malware name.');
      return;
    }

    setLoading(true);
    setCopied(false); // Reset copied status
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

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 sec
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
          <p>🔄 Fetching threat intelligence...</p>
        ) : result ? (
          <>
            <div style={{ marginBottom: '10px' }}>
              <button onClick={handleCopy}>
                {copied ? '✅ Copied!' : '📋 Copy to Clipboard'}
              </button>
            </div>
            <ThreatIntelDisplay aiResponse={result} />
          </>
        ) : null}
      </div>
    </div>
  );
}
