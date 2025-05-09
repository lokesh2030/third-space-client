import React, { useState } from 'react';
import axios from 'axios';

function getRemediationForThreatIntel(summary) {
  if (/C2|Command and Control|FIN7|APT/i.test(summary)) {
    return {
      remediation: [
        'Block domain or IP at firewall and DNS level',
        'Scan systems for outbound traffic to C2',
        'Isolate infected machines',
        'Notify SOC or IR team',
      ],
      timeSavedMinutes: 3,
      valueSaved: '$4',
      isSuspicious: true,
    };
  }

  if (/ransomware|encryption/i.test(summary)) {
    return {
      remediation: [
        'Disconnect affected systems immediately',
        'Restore data from backups',
        'Notify incident response team',
        'Report to authorities if needed',
      ],
      timeSavedMinutes: 4,
      valueSaved: '$5.50',
      isSuspicious: true,
    };
  }

  return {
    remediation: ['No specific remediation required.'],
    timeSavedMinutes: 0,
    valueSaved: '$0',
    isSuspicious: false,
  };
}

const ThreatIntelDisplay = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/threat-intel', { input }); // adjust to your backend
      setOutput(response.data.result);
    } catch (err) {
      console.error('Error:', err);
      setOutput('Error analyzing input.');
    }
    setLoading(false);
  };

  const { remediation, timeSavedMinutes, valueSaved, isSuspicious } =
    getRemediationForThreatIntel(output);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-3">Threat Intelligence</h2>

      <textarea
        className="w-full p-2 border rounded mb-2"
        rows={3}
        placeholder="Paste threat summary or IOCs here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={handleAnalyze}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>

      {output && (
        <div className="mt-4 bg-gray-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">🔍 Result:</h3>
          <p className="mb-2 whitespace-pre-wrap">{output}</p>

          <div className="mt-4">
            <h4 className="font-semibold">
              {isSuspicious ? '✅ Suspicious' : '🟢 Benign'}
            </h4>
            <h4 className="mt-2 font-semibold">🔧 Remediation Suggestion</h4>
            <ul className="list-disc pl-5">
              {remediation.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <p className="mt-2">
              ⏱️ Saved ~{timeSavedMinutes} min • 💵 {valueSaved}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreatIntelDisplay;
