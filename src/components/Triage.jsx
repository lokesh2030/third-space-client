import { useState } from "react";

export default function Triage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [timeSavedMsg, setTimeSavedMsg] = useState("");

  const handleTriageSubmit = async () => {
    if (!input.trim()) {
      setResult("⚠️ Please enter an alert to analyze.");
      return;
    }

    setResult("");
    setTimeSavedMsg("");

    const start = Date.now();

    try {
      const res = await fetch("https://third-space-backend.onrender.com/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alert: input }),
      });

      const data = await res.json();
      setResult(data.result || "❌ No analysis returned.");

      const durationMs = Date.now() - start;
      const baselineMs = 6 * 60 * 1000; // 6 minutes
      const savedMs = Math.max(0, baselineMs - durationMs);
      const savedMin = Math.round(savedMs / 60000);
      const percentFaster = Math.round((savedMs / baselineMs) * 100);

      setTimeSavedMsg(`⏱️ Saved ~${savedMin} min • 🚀 ${percentFaster}% faster than manual triage`);
    } catch (error) {
      console.error("❌ Triage fetch error:", error);
      setResult("❌ Error analyzing alert.");
    }
  };

  const handleDemoAlert = () => {
    setInput("Unusual outbound traffic to rare domain");
    setResult("");
    setTimeSavedMsg("");
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>🚨 Triage</h2>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="e.g. Suspicious login from foreign IP"
        style={{
          width: "300px",
          padding: "8px",
          borderRadius: "6px",
          marginRight: "10px",
          border: "1px solid #ccc",
        }}
      />
      <button onClick={handleTriageSubmit} style={{ padding: "8px 12px" }}>
        Submit
      </button>
      <button onClick={handleDemoAlert} style={{ marginLeft: "10px", padding: "8px 12px" }}>
        Load Demo Alert
      </button>

      <div style={{ marginTop: "1rem", whiteSpace: "pre-wrap" }}>
        <strong>🔍 Result:</strong>
        <p>{result}</p>

        {timeSavedMsg && (
          <p style={{ fontSize: "0.85em", color: "#10b981", marginTop: "0.5rem" }}>
            {timeSavedMsg}
          </p>
        )}

        {result && (
          <p style={{ fontSize: "0.8em", color: "gray" }}>
            💡 AI-generated first pass — use with analyst validation.
          </p>
        )}
      </div>
    </div>
  );
}
