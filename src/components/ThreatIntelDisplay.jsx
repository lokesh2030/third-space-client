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
    };
  }

  return {
    remediation: ['No specific remediation required.'],
    timeSavedMinutes: 0,
    valueSaved: '$0',
  };
}

const ThreatIntelDisplay = () => {
  const [input, setInput] = useState('');
  const [threatIntelOutput, setThreatIntelOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/threat-intel', { input }); // Adjust endpoint as needed
      setThreatIntelOutput(response.data.result);
    } catch (error) {
      console.error('Error fetching threat intel:', error);
      setThreatIntelOutput('Error fetching threat intel.');
    }
    setLoading(false);
  };

  const { remediation, timeSavedMinutes, valueSaved } = getRemediationForThreatIntel(threatIntelOutput);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Threat Intel</h2>

      <textarea
        className="w-full p-2 border rounded mb-2"
        rows={3}
        placeholder="Enter IOC or threat keyword..."
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

      {threatIntelOutput && (
        <div className="mt-4 bg-gray-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">🔍 Threat Intel Result</h3>
          <p>{threatIntelOutput}</p>

          <div className="mt-4">
            <h4 className="font-semibold">🔧 Remediation Suggestions:</h4>
            <ul className="list-disc pl-5">
              {remediation.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <p className="mt-2">⏱️ Saved ~{timeSavedMinutes} min • 💵 {valueSaved}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreatIntelDisplay;
