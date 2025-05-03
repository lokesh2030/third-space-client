import React from "react";

const ThreatIntelDisplay = ({ aiResponse }) => {
  if (!aiResponse) {
    return <div>No threat intelligence data available.</div>;
  }

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px", marginTop: "20px" }}>
      <h2 style={{ marginBottom: "10px" }}>Threat Intelligence Summary</h2>

      <pre style={{
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        backgroundColor: '#f9fafb',
        padding: '16px',
        borderRadius: '8px',
        fontSize: '0.95em',
        lineHeight: '1.6',
        border: '1px solid #e5e7eb',
        color: '#111827'
      }}>
        {aiResponse}
      </pre>
    </div>
  );
};

export default ThreatIntelDisplay;
