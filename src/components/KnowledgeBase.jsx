import { useState } from "react";
import axios from "axios";

export default function KnowledgeBase() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeSavedMsg, setTimeSavedMsg] = useState("");
  const [kbCount, setKbCount] = useState(0); // global counter

  const HOURLY_RATE = 75;
  const MINUTES_SAVED = 5;
  const MINUTE_RATE = HOURLY_RATE / 60;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOutput("");
    setTimeSavedMsg("");

    const start = Date.now();

    try {
      const res = await axios.post("https://third-space-backend.onrender.com/api/kb", {
        question: input,
      });

      const durationMs = Date.now() - start;
      const savedMs = Math.max(0, MINUTES_SAVED * 60000 - durationMs);
      const savedMin = (savedMs / 60000).toFixed(1);
      const percentFaster = ((savedMs / (MINUTES_SAVED * 60000)) * 100).toFixed(1);
      const dollarSaved = (savedMin * MINUTE_RATE).toFixed(0);

      setOutput(res.data.result || "No response.");
      setTimeSavedMsg(`✅ Saved ~${savedMin} min = 💵 ~$${dollarSaved} • 🚀 ${percentFaster}% faster`);
      setKbCount((prev) => prev + 1); // update global counter
    } catch (err) {
      console.error("KB error:", err.message);
      setOutput("Something went wrong.");
    }

    setLoading(false);
  };

  const totalTimeSaved = (kbCount * MINUTES_SAVED).toFixed(1);
  const totalDollarSaved = ((kbCount * MINUTES_SAVED) * MINUTE_RATE).toFixed(0);

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
            <p style={{ marginTop: 12, color: "#10b981" }}>{timeSavedMsg}</p>
          )}
          <p style={{ fontSize: "0.9em", color: "#38bdf8", marginTop: "0.25rem" }}>
            📊 Total Saved in Knowledge Base: {totalTimeSaved} min • 💰 ~${totalDollarSaved}
          </p>
        </div>
      )}
    </div>
  );
}
