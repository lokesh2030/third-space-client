import React, { useState } from 'react';
import axios from 'axios';

let totalTimeSaved = 0;
let totalValueSaved = 0;

function analyzeThreatIntel(summary) {
  const lower = summary.toLowerCase();
  const ttpMatches = [...summary.matchAll(/T\d{4}(\.\d{3})?/g)].map((m) => m[0]);

  const mappings = [
    { keyword: /emotet|trickbot|ryuk/, actor: 'Emotet Campaign', routeTo: 'IR Team' },
    { keyword: /fin7/, actor: 'FIN7', routeTo: 'Firewall Team' },
    { keyword: /lazarus/, actor: 'Lazarus Group', routeTo: 'Threat Intel Team' },
    { keyword: /apt\d+/, actor: 'APT Group', routeTo: 'Threat Intel Team' },
    { keyword: /ransomware/, actor: 'Ransomware Threat', routeTo: 'IR Team' },
    { keyword: /phishing|spearphishing/, actor: 'Phishing Attack', routeTo: 'Email Security Team' },
    { keyword: /c2|command and control/, actor: 'C2 Infrastructure', routeTo: 'Firewall Team' }
  ];

  let actor = 'Unknown Threat';
  let routeTo = 'SOC Team';

  for (const map of mappings) {
    if (map.keyword.test(lower)) {
      actor = map.actor;
      routeTo = map.routeTo;
      break;
    }
  }

  const timeSaved = 6.0;
  const valueSaved = 8;
  const percentageFaster = 99.2;

  totalTimeSaved += timeSaved;
  totalValueSaved += valueSaved;

  const remediationAnalysis = `Analysis:
- Threat Actor or Technique: ${actor}
- Observed TTPs: ${ttpMatches.length > 0 ? ttpMatches.join(', ') : 'N/A'}

Recommended Action:
1. Triage all systems showing IOCs related to this threat.
2. Isolate potentially affected systems.
3. Investigate lateral movement and persistence techniques.
4. Block malicious IPs/domains identified in the report.
5. Engage the appropriate team (${routeTo}) for follow-up.

Severity: High`;

  return {
    isSuspicious: true,
    remediationAnalysis,
    timeSaved,
    valueSaved,
    percentageFaster,
    routeTo
  };
}

const ThreatIntelDisplay = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/threat-intel', { input }); // Replace with your actual API
      setResult(res.data.result);
      setAnalysis(analyzeThreatIntel(res.data.result));
    } catch (err) {
      console.error(err);
      setResult('Error processing threat intel.');
      setAnalysis(null);
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-3">Threat Intelligence</h2>

      <textarea
        className="w-full p-2 border rounded mb-2"
        rows={4}
        placeholder="Paste threat intel summary, IOCs, or report..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleAnalyze}
        disabled={loading}
      >
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>

      {result && analysis && (
        <div className="mt-4 bg-gray-100 p-4 rounded shadow whitespace-pre-wrap">
          <h3 className="text-lg font-semibold mb-2">🔍 Result:</h3>
          <p>{result}</p>

          <div className="mt-4">
            <p>⏱️ Saved ~{analysis.timeSaved.toFixed(1)} min • 🚀 {analysis.percentageFaster}% faster • 💵 This Run: ~${analysis.valueSaved}</p>
            <p>📊 Total Saved in Threat Intel Mode: {totalTimeSaved.toFixed(1)} min • 💰 ~${totalValueSaved}</p>

            <h4 className="mt-4 font-semibold">🔧 Remediation Suggestion</h4>
            <p>{analysis.remediationAnalysis}</p>

            <p className="mt-4">📍 Route to: {analysis.routeTo}</p>

            <button
              className="mt-2 bg-gray-300 px-3 py-1 rounded text-sm"
              onClick={() => navigator.clipboard.writeText(result)}
            >
              Copy Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreatIntelDisplay;
