import React from "react";

const ThreatIntelDisplay = ({ aiResponse }) => {
  if (!aiResponse) {
    return <div>No threat intelligence data available.</div>;
  }

  // Split structured section from narrative
  const splitResponse = aiResponse.split('---');
  const structuredPart = splitResponse[0].trim();
  const narrativePart = splitResponse[1]?.trim();

  // Extract fields from structured section
  const extractField = (label) => {
    const regex = new RegExp(`${label}: (.*)`, 'i');
    const match = structuredPart.match(regex);
    return match ? match[1].trim() : 'Not available';
  };

  const threatActor = extractField('Threat Actor');
  const motivation = extractField('Motivation');
  const techniques = extractField('Primary Techniques');
  const tools = extractField('Known Tools');
  const mitreTechniques = extractField('Relevant MITRE Techniques');

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px", marginTop: "20px" }}>
      <h2>Threat Intelligence Summary</h2>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
        <tbody>
          <tr>
            <td style={styles.label}>Threat Actor:</td>
            <td style={styles.value}>{threatActor}</td>
          </tr>
          <tr>
            <td style={styles.label}>Motivation:</td>
            <td style={styles.value}>{motivation}</td>
          </tr>
          <tr>
            <td style={styles.label}>Primary Techniques:</td>
            <td style={styles.value}>{techniques}</td>
          </tr>
          <tr>
            <td style={styles.label}>Known Tools:</td>
            <td style={styles.value}>{tools}</td>
          </tr>
          <tr>
            <td style={styles.label}>Relevant MITRE Techniques:</td>
            <td style={styles.value}>{mitreTechniques}</td>
          </tr>
        </tbody>
      </table>

      {narrativePart && (
        <>
          <h3 style={{ marginTop: "30px" }}>Detailed Analysis</h3>
          <p style={{ marginTop: "10px", lineHeight: "1.6" }}>{narrativePart}</p>
        </>
      )}
    </div>
  );
};

const styles = {
  label: {
    fontWeight: "bold",
    padding: "8px",
    backgroundColor: "#f5f5f5",
    border: "1px solid #ddd",
    width: "200px"
  },
  value: {
    padding: "8px",
    border: "1px solid #ddd"
  }
};

export default ThreatIntelDisplay;
