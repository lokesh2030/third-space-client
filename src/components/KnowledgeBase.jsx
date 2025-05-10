// KnowledgeBase.jsx — Triage-style UI and remediation logic
import React, { useState } from 'react';
import axios from 'axios';

const MINUTE_RATE = 75 / 60;
let totalKbTimeSaved = 0;

function getKbInsights(answer) {
  const lower = answer.toLowerCase();
  let routeTo = 'Security Team';
  const remediation = [];

  if (lower.includes('phishing')) {
    routeTo = 'Email Security Team';
    remediation.push('Educate users on identifying phishing red flags.');
    remediation.push('Enable anti-phishing policies in your email provider.');
  }
  if (lower.includes('ransomware')) {
    routeTo = 'IR Team';
    remediation.push('Ensure off-site backups are up-to-date and tested.');
    remediation.push('Isolate infected systems immediately.');
  }
  if (lower.includes('mfa') || lower.includes('multi-factor')) {
    routeTo = 'IT Team';
    remediation.push('Ensure MFA is enabled for all privileged accounts.');
  }
  if (remediation.length === 0) {
    remediation.push('Review this issue with the SOC team for further action.');
  }

  const timeSaved = 5.0;
  const valueSaved = timeSaved * MINUTE_RATE;
  totalKbTimeSaved += timeSaved;

  return { timeSaved, valueSaved, remediation, routeTo };
}

const KnowledgeBase = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/kb', { question: input });
      const result = res.data.result || 'No answer returned.';
      setOutput(result);
      setInsight(getKbInsights(result));
    } catch (err) {
      setOutput('Error retrieving answer.');
    }
    setLoading(false);
  };

  return (
    <div style={{ color: 'white' }}>
      <form onSubmit={handleSubmit}>
        <textarea
          rows={6}
          placeholder="Paste your KB question here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: '100%', padding: 16, fontSize: 16, borderRadius: 6, marginBottom: 20 }}
        />
        <button
          type="submit"
          style={{ backgroundColor: '#3b82f6', color: 'white', padding: '12px 24px', fontSize: 16, border: 'none', borderRadius: 6 }}
        >
          {loading ? 'Working...' : 'Submit'}
        </button>
      </form>

      {output && insight && (
        <div style={{ marginTop: 40, background: '#1e293b', padding: 20, borderRadius: 8 }}>
          <h3>🔍 Result:</h3>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{output}</pre>

          <p style={{ marginTop: 8, color: '#10b981' }}>
            ⏱️ Saved ~{insight.timeSaved.toFixed(1)} min • 💵 ~${insight.valueSaved.toFixed(0)}
          </p>
          <p style={{ fontSize: '0.9em', color: '#38bdf8', marginTop: '0.25rem' }}>
            📊 Total Saved in KB Mode: {totalKbTimeSaved.toFixed(1)} min • 💰 ~${(totalKbTimeSaved * MINUTE_RATE).toFixed(0)}
          </p>

          <div style={{ marginTop: 20, backgroundColor: '#0f172a', padding: '1rem', borderRadius: '8px' }}>
            <h4 style={{ color: '#facc15' }}>🔧 Remediation Suggestion</h4>
            <ul style={{ paddingLeft: 20, color: '#e0f2fe' }}>
              {insight.remediation.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <p style={{ marginTop: '0.5rem', color: '#38bdf8' }}>
              📍 Route to: <strong>{insight.routeTo}</strong>
            </p>
            <button
              onClick={() => navigator.clipboard.writeText(`KB Answer:\n${output}\n\nRemediation:\n${insight.remediation.join('\n')}\n\nRoute to: ${insight.routeTo}`)}
              style={{ marginTop: '0.75rem', padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: 6 }}
            >
              Copy Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
