import { useState } from "react";
import PhishingDetection from "./components/phishing";

const BACKEND_URL = "https://third-space-backend.onrender.com";

export default function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("triage");
  const [selectedTab, setSelectedTab] = useState("CoPilot");
  const [timeSavedMsg, setTimeSavedMsg] = useState("");
  const [triageCount, setTriageCount] = useState(0);
  const [threatIntelCount, setThreatIntelCount] = useState(0);
  const [kbCount, setKbCount] = useState(0);
  const [ticketCount, setTicketCount] = useState(0);
  const [phishingCount, setPhishingCount] = useState(0);
  const totalGlobalTimeSaved =
  triageCount * 6 +
  threatIntelCount * 10 +
  kbCount * 5 +
  ticketCount * 8 +
  phishingCount * 3; // ✅ add phishing
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOutput("");
    setTimeSavedMsg("");

    const start = Date.now();

    let payload = {};
    if (mode === "triage") payload = { alert: input };
    else if (mode === "threat-intel") payload = { keyword: input };
    else if (mode === "ticket") payload = { incident: input };
    else if (mode === "kb") payload = { question: input };

    try {
      const res = await fetch(`${BACKEND_URL}/api/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setOutput(data.result || "Something went wrong.");

      const durationMs = Date.now() - start;

      if (mode === "triage") {
        const baselineMs = 6 * 60 * 1000;
        const savedMs = Math.max(0, baselineMs - durationMs);
        const savedMin = (savedMs / 60000).toFixed(1);
        const percentFaster = ((savedMs / baselineMs) * 100).toFixed(1);
        setTimeSavedMsg(`⏱️ Saved ~${savedMin} min • 🚀 ${percentFaster}% faster than manual triage`);
        setTriageCount((prev) => prev + 1);
      }

      if (mode === "threat-intel") {
        const baselineMs = 7 * 60 * 1000;
        const savedMs = Math.max(0, baselineMs - durationMs);
        const savedMin = (savedMs / 60000).toFixed(1);
        const percentFaster = ((savedMs / baselineMs) * 100).toFixed(1);
        setTimeSavedMsg(`⏱️ Saved ~${savedMin} min • 🚀 ${percentFaster}% faster than manual research`);
        setThreatIntelCount((prev) => prev + 1);
      }

      if (mode === "kb") {
        const baselineMs = 5 * 60 * 1000;
        const savedMs = Math.max(0, baselineMs - durationMs);
        const savedMin = (savedMs / 60000).toFixed(1);
        const percentFaster = ((savedMs / baselineMs) * 100).toFixed(1);
        setTimeSavedMsg(`⏱️ Saved ~${savedMin} min • 🚀 ${percentFaster}% faster than searching the KB manually`);
        setKbCount((prev) => prev + 1);
      }

      if (mode === "ticket") {
        const baselineMs = 8 * 60 * 1000;
        const savedMs = Math.max(0, baselineMs - durationMs);
        const savedMin = (savedMs / 60000).toFixed(1);
        const percentFaster = ((savedMs / baselineMs) * 100).toFixed(1);
        setTimeSavedMsg(`⏱️ Saved ~${savedMin} min • 🚀 ${percentFaster}% faster than writing incidents manually`);
        setTicketCount((prev) => prev + 1);
      }
    } catch (err) {
      setOutput("Error: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ background: "#0f172a", color: "white", minHeight: "100vh", padding: 40, fontFamily: "Arial" }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>🛡️ Third Space Co-Pilot</h1>

      {/* Tab Selector */}
      <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
        <button
          onClick={() => setSelectedTab("CoPilot")}
          style={{
            padding: "8px 16px",
            backgroundColor: selectedTab === "CoPilot" ? "#3b82f6" : "#1e293b",
            border: "none",
            color: "white",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Co-Pilot
        </button>
        <button
          onClick={() => setSelectedTab("Phishing")}
          style={{
            padding: "8px 16px",
            backgroundColor: selectedTab === "Phishing" ? "#3b82f6" : "#1e293b",
            border: "none",
            color: "white",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Phishing Detection
        </button>
      </div>

      {/* CoPilot */}
      {selectedTab === "CoPilot" && (
        <>
          <div style={{ marginBottom: 20 }}>
            <strong>Choose Mode:</strong>
            <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
              {["triage", "threat-intel", "ticket", "kb"].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: mode === m ? "#3b82f6" : "#1e293b",
                    border: "none",
                    color: "white",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  {m.replace("-", " ").toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <textarea
              rows={6}
              placeholder={`Paste your ${
                mode === "triage"
                  ? "alert"
                  : mode === "ticket"
                  ? "incident"
                  : mode === "kb"
                  ? "question"
                  : "keyword"
              } here...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                width: "100%",
                padding: 16,
                fontSize: 16,
                borderRadius: 6,
                marginBottom: 20,
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: "#3b82f6",
                color: "white",
                padding: "12px 24px",
                fontSize: 16,
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              {loading ? "Working..." : "Submit"}
            </button>
          </form>

          {output && (
            <div style={{ marginTop: 40, background: "#1e293b", padding: 20, borderRadius: 8 }}>
              <h3 style={{ marginBottom: 10 }}>🔍 Result:</h3>
              <pre style={{ whiteSpace: "pre-wrap" }}>{output}</pre>

              {["triage", "threat-intel", "kb", "ticket"].includes(mode) && timeSavedMsg && (
                <p style={{ fontSize: "0.85em", color: "#10b981", marginTop: "0.5rem" }}>{timeSavedMsg}</p>
              )}

              {mode === "triage" && triageCount > 0 && (
                <div style={{ marginTop: "1rem", backgroundColor: "#0f172a", padding: "1rem", borderRadius: "8px" }}>
                  <p style={{ fontWeight: "bold", color: "#fbbf24" }}>
                    📈 Total Time Saved: {(triageCount * 6).toFixed(1)} minutes
                    const HOURLY_RATE = 75;
                    const MINUTE_RATE = HOURLY_RATE / 60;

                  </p>
                  <p style={{ fontSize: "0.85em", color: "#cbd5e1" }}>
                    ({triageCount} lookups × 6 min each)
                  </p>
                </div>
              )}

              {mode === "threat-intel" && threatIntelCount > 0 && (
                <div style={{ marginTop: "1rem", backgroundColor: "#0f172a", padding: "1rem", borderRadius: "8px" }}>
                  <p style={{ fontWeight: "bold", color: "#fbbf24" }}>
                    📈 Total Time Saved: {(threatIntelCount * 10).toFixed(1)} minutes
                    const HOURLY_RATE = 75;
                    const MINUTE_RATE = HOURLY_RATE / 60;

                  </p>
                  <p style={{ fontSize: "0.85em", color: "#cbd5e1" }}>
                    ({threatIntelCount} lookups × 10 min each)
                  </p>
                </div>
              )}

              {mode === "kb" && kbCount > 0 && (
                <div style={{ marginTop: "1rem", backgroundColor: "#0f172a", padding: "1rem", borderRadius: "8px" }}>
                  <p style={{ fontWeight: "bold", color: "#fbbf24" }}>
                    📈 Total Time Saved: {(kbCount * 5).toFixed(1)} minutes
                    const HOURLY_RATE = 75;
                    const MINUTE_RATE = HOURLY_RATE / 60;

                  </p>
                  <p style={{ fontSize: "0.85em", color: "#cbd5e1" }}>
                    ({kbCount} questions × 5 min each)
                  </p>
                </div>
              )}

              {mode === "ticket" && ticketCount > 0 && (
                <div style={{ marginTop: "1rem", backgroundColor: "#0f172a", padding: "1rem", borderRadius: "8px" }}>
                  <p style={{ fontWeight: "bold", color: "#fbbf24" }}>
                    📈 Total Time Saved: {(ticketCount * 8).toFixed(1)} minutes
                    const HOURLY_RATE = 75;
                    const MINUTE_RATE = HOURLY_RATE / 60;

                  </p>
                  <p style={{ fontSize: "0.85em", color: "#cbd5e1" }}>
                    ({ticketCount} tickets × 8 min each)
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Phishing */}
      {selectedTab === "Phishing" && <PhishingDetection setPhishingCount={setPhishingCount} />}

      {/* Global Total */}
      {totalGlobalTimeSaved > 0 && (
        <div style={{ marginTop: 40, backgroundColor: "#1e293b", padding: "1rem", borderRadius: "8px", textAlign: "center" }}>
          <p style={{ fontWeight: "bold", color: "#4ade80", fontSize: "1.1em" }}>
            🧠 Total Time Saved Across All Modes: {totalGlobalTimeSaved.toFixed(1)} minutes
            const HOURLY_RATE = 75;
            const MINUTE_RATE = HOURLY_RATE / 60;
          </p>
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: 40, textAlign: "center", fontSize: 14, color: "#94a3b8" }}>
        © 2025 Third Space Security · All rights reserved
      </div>
    </div>
  );
}
