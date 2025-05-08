// phishing.jsx (updated with remediation + total savings logic)
import { useState } from "react";

export default function PhishingDetection({ setPhishingCount }) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeSavedMsg, setTimeSavedMsg] = useState("");
  const [localCount, setLocalCount] = useState(0);

  const HOURLY_RATE = 75;
  const MINUTE_RATE = HOURLY_RATE / 60;

  const getPhishingRemediation = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes("link") || lower.includes("credential")) {
      return {
        action: "Block the sender domain and reset credentials for affected users.",
        team: "IT Team",
      };
    } else if (lower.includes("attachment") || lower.includes("payload")) {
      return {
        action: "Block the sender and scan affected devices for malware.",
        team: "Security Team",
      };
    }
    return {
      action: "Quarantine the message and alert users not to interact.",
      team: "IT Team",
    };
  };

  const handleCheck = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setResult("");
    setTimeSavedMsg("");

    const start = Date.now();

    try {
      const res = await fetch("https://third-space-backend.onrender.com/api/phishing-detect", {
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
      setTimeSavedMsg(`⏱️ Saved ~${savedMin} min • 💵 ~$${((savedMin * MINUTE_RATE).toFixed(0))} • 🚀 ${percentFaster}% faster`);

      // Increment counts
      setLocalCount((prev) => prev + 1);
      setPhishingCount((prev) => prev + 1);
    } catch (err) {
      setResult("❌ Error: " + err.message);
    }

    setLoading(false);
  };

  const remediation = result ? getPhishingRemediation(result) : null;

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
            <>
              <p style={{ fontSize: "0.85em", color: "#10b981", marginTop: "0.5rem" }}>{timeSavedMsg}</p>
              <p style={{ fontSize: "0.9em", color: "#38bdf8", marginTop: "0.25rem" }}>
                📊 Total Saved in Phishing Detection: {(localCount * 3).toFixed(1)} min • 💰 ~${((localCount * 3) * MINUTE_RATE).toFixed(0)}
              </p>
            </>
          )}

          {remediation && (
            <div style={{ marginTop: 20, backgroundColor: "#0f172a", padding: "1rem", borderRadius: "8px" }}>
              <h4 style={{ color: "#facc15" }}>🔧 Remediation Suggestion</h4>
              <p style={{ color: "#e0f2fe" }}>{remediation.action}</p>
              <p style={{ marginTop: "0.5rem", color: "#38bdf8" }}>
                📍 Route to: <strong>{remediation.team}</strong>
              </p>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `Remediation Action:\n${remediation.action}\n\nRoute to: ${remediation.team}`
                  )
                }
                style={{ marginTop: "0.75rem", padding: "0.5rem 1rem", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: 6 }}
              >
                Copy Ticket
              </button>
            </div>
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
