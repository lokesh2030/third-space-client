import { useState } from "react";
import axios from "axios";

export default function KnowledgeBase({ setKbCount }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeSavedMsg, setTimeSavedMsg] = useState("");

  const MINUTE_RATE = 75 / 60; // $75/hour rate
  const MINUTES_SAVED = 5;

  const getTargetTeam = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes("email") || lower.includes("phishing")) return "Email Security Team";
    if (lower.includes("firewall") || lower.includes("block")) return "Firewall Team";
    if (lower.includes("network")) return "Network Team";
    if (lower.includes("password") || lower.includes("login")) return "IT Team";
    return "Security Team";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOutput("");
    setTimeSavedMsg("");

    try {
      const res = await axios.post("/api/kb", { question: input });
      const result = res.data.result || "No response received.";
      setOutput(result);

      const savedMin = MINUTES_SAVED.toFixed(1);
      const savedValue = (savedMin * MINUTE_RATE).toFixed(0);
      const percentFaster = (100 - (1 / MINUTES_SAVED) * 100).toFixed(1);

      setTimeSavedMsg(`⏱️ Saved ~${savedMin} min • 🚀 ${percentFaster}% faster • 💵 This Run: ~$${savedValue}`);
      setKbCount((prev) => prev + 1);
    } catch (err) {
      console.error("KB API error:", err.message);
      setOutput("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📚 Knowledge Base</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          rows={5}
          value={input}
          placeholder="Ask any cybersecurity question..."
          onChange={(e) => setInput(e.target.value)}
          style={{ width: "100%", padding: 12, fontSize: 16, borderRadius: 6, marginBottom: 12 }}
        />
        <button type="submit" disabled={loading} style={{ padding: "10px 20px", fontSize: 16, backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: 6 }}>
          {loading ? "Working..." : "Submit"}
        </button>
      </form>

      {output && (
        <div style={{ marginTop: 30, backgroundColor: "#1e293b", padding: 20, borderRadius: 8 }}>
          <h3>🔍 Answer:</h3>
          <pre style={{ whiteSpace: "pre-wrap", color: "#e0f2fe" }}>{output}</pre>

          {timeSavedMsg && (
            <>
              <p style={{ color: "#10b981", marginTop: 12 }}>{timeSavedMsg}</p>
              <p style={{ fontSize: "0.9em", color: "#38bdf8" }}>
                📊 Total Saved in Knowledge Base Mode: {(MINUTES_SAVED).toFixed(1)} min • 💰 ~${(MINUTES_SAVED * MINUTE_RATE).toFixed(0)}
              </p>
            </>
          )}

          <div style={{ marginTop: 20, backgroundColor: "#0f172a", padding: 16, borderRadius: 8 }}>
            <h4 style={{ color: "#facc15" }}>🔧 Remediation Suggestion</h4>
            <p style={{ color: "#e0f2fe" }}>{output}</p>
            <p style={{ marginTop: 10, color: "#38bdf8" }}>
              📍 Route to: <strong>{getTargetTeam(output)}</strong>
            </p>
            <button
              onClick={() =>
                navigator.clipboard.writeText(`Remediation Action:\n${output}\n\nRoute to: ${getTargetTeam(output)}`)
              }
              style={{ marginTop: 12, padding: "8px 16px", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: 6 }}
            >
              Copy Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
