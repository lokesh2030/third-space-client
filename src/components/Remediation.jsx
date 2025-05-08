import React, { useState, useEffect } from 'react';

const Remediation = () => {
  const [remediations, setRemediations] = useState([]);

  useEffect(() => {
    fetch('/api/remediation')
      .then((res) => res.json())
      .then((data) => setRemediations(data))
      .catch((err) => console.error(err));
  }, []);

  const copyToClipboard = (rem) => {
    const text = `Alert: ${rem.alert}\nAction: ${rem.action}\nTarget Team: ${rem.targetTeam}`;
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Remediation Suggestions</h2>
      {remediations.map((rem, index) => (
        <div key={index} className="border rounded-lg p-4 mb-4 shadow">
          <p><strong>Alert:</strong> {rem.alert}</p>
          <p><strong>Suggested Action:</strong> {rem.action}</p>
          <p><strong>Target Team:</strong> {rem.targetTeam}</p>
          <button
            onClick={() => copyToClipboard(rem)}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Copy Ticket
          </button>
        </div>
      ))}
    </div>
  );
};

export default Remediation;
