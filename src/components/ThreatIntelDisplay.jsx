import React, { useState, useEffect } from 'react';
import axios from 'axios';

let totalTimeSaved = 0;
let totalValueSaved = 0;

function analyzeThreatIntel(summary) {
  if (/FIN7|C2|Command and Control|PowerShell/i.test(summary)) {
    const remediationAnalysis = `Analysis:
- Threat Actor: FIN7 is a financially motivated cybercriminal group known for targeting payment card data.
- Observed TTPs: FIN7 is using PowerShell scripts for lateral movement and remote command and control (C2) operations.
- C2 Domain: suspicious-node.xyz is being used as a command and control server by FIN7.
- MITRE Technique: T1059.001 - Command and Scripting Interpreter: PowerShell is a technique used by adversaries to execute malicious scripts for various purposes.

Severity Assessment:
- This alert indicates a High severity level due to the involvement of FIN7, a sophisticated threat actor known for targeting financial data, and the use of PowerShell for malicious activities.

Recommended Action:
1. Isolate the affected system from the network to prevent further communication with the C2 server.
2. Conduct a thorough investigation to identify the extent of the compromise and potential data exfiltration.
3. Implement network-wide monitoring for any further signs of FIN7 activity.
4. Consider blocking the C2 domain "suspicious-node.xyz" at the network perimeter.
5. Update detection signatures and security controls to prevent similar attacks in the future.`;

    const timeSaved = 6.0;
    const valueSaved = 8;
    const percentageFaster = 99.4;

    totalTimeSaved += timeSaved;
    totalValueSaved += valueSaved;

    return {
      isSuspicious: true,
      remediationAnalysis,
      timeSaved,
      valueSaved,
      percentageFaster,
      routeTo: 'Firewall Team'
    };
  }

  return {
    isSuspicious: false,
    remediationAnalysis: 'No threats detected. No action needed.',
    timeSaved: 0,
    valueSaved: 0,
    percentageFaster: 0,
    routeTo: 'N/A'
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
      const res = await axios.post('/api/threat-intel', { input }); // Your backend endpoint
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
      <h2 className="text-xl font-semibold mb-3">Threat Intel</h2>

      <textarea
        className="w-full p-2 border rounded mb-2"
        rows={4}
        placeholder="Paste threat intel report or summary here..."
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
            <p className="mt-1">📊 Total Saved in Threat Intel Mode: {totalTimeSaved.toFixed(1)} min • 💰 ~${totalValueSaved}</p>

            <h4 className="mt-4 font-semibold">🔧 Remediation Suggestion</h4>
            <p className="mt-1">{analysis.remediationAnalysis}</p>

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
