import { useState } from "react";

export default function PhishingDetection({ setPhishingCount }) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeSavedMsg, setTimeSavedMsg] = useState("");
  const [localCount, setLocalCount] = useState(0);

  const handleCheck = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setResult("");
    setTimeSavedMsg("");

    const start = Date.now();

    try {
      const res = await fetch("https://third-space-backend.onrender.com/api/phishing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      const data = await res.json();
      setResult(data.result || "No suspicious indicators found.");

      // ⏱️ Time saved calculation
      const durationMs = Date.now() - start;
      const baselineMs = 3 * 60 * 1000;
      const savedMs = Math.max(0, baselineMs - durationMs);
      const savedMin = (savedMs / 60000).toFixed(1);
      const percentFaster = ((savedMs / baselineMs) * 100).toFixed(1);
      setTimeSavedMsg(`⏱️ Saved ~${savedMin} min • 🚀 ${percentFaster}% faster than manual phishing analysis`);

      // Increment counts
      setLocalCount((prev) => prev + 1);
      setPhishingCount((prev) => prev + 1); // updates App.jsx
    } catch (err) {
      setResult("❌ Error: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>🎣 Phishing Detection</h2>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste suspected phishing email or message..."
        rows={6}
        style={{ width: "100%", padding: 12, fontSize: 16, borderRadius: 6, marginBottom: 12 }}
      />

      <button
        onClick={handleCheck}
        style={{
          backgroundColor: "#3b82f6",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        {loading ? "Analyzing..." : "Check"}
      </button>

      {result && (
        <div style={{ marginTop: 30, backgroundColor: "#1e293b", padding: 20, borderRadius: 8 }}>
          <h3>🔍 Result:</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>{result}</pre>

          {timeSavedMsg && (
            <p style={{ fontSize: "0.85em", color: "#10b981", marginTop: "0.5rem" }}>
              {timeSavedMsg}
            </p>
          )}

          {localCount > 0 && (
            <div style={{ marginTop: "1rem", backgroundColor: "#0f172a", padding: "1rem", borderRadius: "8px" }}>
              <p style={{ fontWeight: "bold", color: "#fbbf24" }}>
                📈 Total Time Saved: {(localCount * 3).toFixed(1)} minutes
              </p>
              <p style={{ fontSize: "0.85em", color: "#cbd5e1" }}>
                ({localCount} checks × 3 min each)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
