import { useState } from "react";

export default function Triage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [timeSavedMsg, setTimeSavedMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTriageSubmit = async () => {
    if (!input.trim()) {
      setResult("⚠️ Please enter an alert to analyze.");
      return;
    }

    setLoading(true);
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

      const durationMs = Date.now() - start;
      const baselineMs = 6 * 60 * 1000; // 6 minutes
      const savedMs = Math.max(0, baselineMs - durationMs);
      const savedMin = (savedMs / 60000).toFixed(1);
      const percentFaster = ((savedMs / baselineMs) * 100).toFixed(1);

      setTimeSavedMsg(`⏱️ Saved ~${savedMin} min • 🚀 ${percentFaster}% faster than manual triage`);
      setResult(data.result || "❌ No analysis returned.");
    } catch (error) {
      console.error("❌ Triage fetch error:", error);
      setResult("❌ Error analyzing alert.");
    }

    setLoading(false);
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
      <button onClick={handleTriageSubmit} disabled={loading} style={{ padding: "8px 12px" }}>
        {loading ? "Analyzing..." : "Submit"}
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
