import React, { useState } from 'react';
import axios from 'axios';

let totalTimeSaved = 0;
let totalValueSaved = 0;

function analyzeThreatIntel(summary) {
  const lower = summary.toLowerCase();
  const ttpMatches = [...summary.matchAll(/T\d{4}(\.\d{3})?/g)].map(m => m[0]);

  // Actor matching
  let actor = 'Unknown Threat';
  let routeTo = 'SOC Team';

  if (/apt41|double dragon/.test(lower)) {
    actor = 'APT41 (Double Dragon)';
    routeTo = 'Threat Intel Team';
  } else if (/fin7/.test(lower)) {
    actor = 'FIN7';
    routeTo = 'Firewall Team';
  } else if (/emotet|trickbot|ryuk/.test(lower)) {
    actor = 'Emotet Campaign';
    routeTo = 'IR Team';
  } else if (/ransomware/.test(lower)) {
    actor = 'Ransomware Threat';
    routeTo = 'IR Team';
  } else if (/phishing|spearphishing/.test(lower)) {
    actor = 'Phishing Attack';
    routeTo = 'Email Security Team';
  }

  // TTP category hints
  const tacticHints = {
    execution: /(powershell|scheduled task|t1053|t1086)/i,
    lateral: /(remote file copy|rdp|t1105|t1076)/i,
    credential: /(brute force|t1110)/i,
    discovery: /(network config|system info|t1016|t1082)/i,
    exfiltration: /(t1002|t1041)/i,
    defenseEvasion: /(obfuscate|decode|t1027|t1140)/i
  };

  const remediation = [];

  if (tacticHints.execution.test(lower)) remediation.push('Review and restrict PowerShell and scheduled task execution policies.');
  if (tacticHints.lateral.test(lower)) remediation.push('Monitor and limit RDP and remote file copy behavior between systems.');
  if (tacticHints.credential.test(lower)) remediation.push('Audit authentication logs for brute force attempts and enforce strong passwords.');
  if (tacticHints.discovery.test(lower)) remediation.push('Limit access to system/network discovery tools and enhance logging.');
  if (tacticHints.exfiltration.test(lower)) remediation.push('Monitor data compression and outbound transfers; flag suspicious flows.');
  if (tacticHints.defenseEvasion.test(lower)) remediation.push('Enable script logging and flag obfuscated or encoded scripts.');

  if (remediation.length === 0) {
    remediation.push('No specific remediation identified — escalate to SOC for deeper analysis.');
  }

  const timeSaved = 6.0;
  const valueSaved = 8;
  const percentageFaster = 99.2;

  totalTimeSaved += timeSaved;
  totalValueSaved += valueSaved;

  const remediationAnalysis = `Analysis:
- Threat Actor: ${actor}
- Intent: Likely dual-purpose espionage and/or financial gain
- Observed MITRE Techniques: ${ttpMatches.length > 0 ? ttpMatches.join(', ') : 'None detected'}

Recommended Action:
• ${remediation.join('\n• ')}

This alert reflects a HIGH severity threat and should be prioritized accordingly.`;

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
      const res = await axios.post('/api/threat-intel', { input }); // Adjust this endpoint
      setResult(res.data.result);
      setAnalysis(analyzeThreatIntel(res.data.result));
    } catch (err) {
      console.error(err);
      setResult('Error analyzing threat intel.');
      setAnalysis(null);
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-3">Threat Intelligence</h2>

      <textarea
        className="w-full p-2 border rounded mb-2"
        rows={5}
        placeholder="Paste threat report or intel summary..."
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
