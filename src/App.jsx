import Integrations from "./components/Integrations";
import { useState } from "react";
import PhishingDetection from "./components/phishing";
import KnowledgeBase from "./components/KnowledgeBase";
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
    phishingCount * 3;

  const HOURLY_RATE = 75;
  const MINUTE_RATE = HOURLY_RATE / 60;

  const getTargetTeam = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes("firewall")) return "Firewall Team";
    if (lower.includes("reset password") || lower.includes("account")) return "IT Team";
    if (lower.includes("isolate") || lower.includes("network")) return "Network Team";
    if (lower.includes("intel")) return "Threat Intel Team";
    if (lower.includes("phishing")) return "Email Security Team";
    if (lower.includes("ir team")) return "IR Team";
    return "Security Team";
  };

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

    try {
      const res = await fetch(`${BACKEND_URL}/api/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setOutput(data.result || "Something went wrong.");

      const durationMs = Date.now() - start;
      const updateMetrics = (countSetter, minutes) => {
        const savedMs = Math.max(0, minutes * 60000 - durationMs);
        const savedMin = (savedMs / 60000).toFixed(1);
        const percentFaster = ((savedMs / (minutes * 60000)) * 100).toFixed(1);
        setTimeSavedMsg(`⏱️ Saved ~${savedMin} min • 🚀 ${percentFaster}% faster • 💵 This Run: ~$${(savedMin * MINUTE_RATE).toFixed(0)}`);
        countSetter((prev) => prev + 1);
      };

      if (mode === "triage") updateMetrics(setTriageCount, 6);
      if (mode === "threat-intel") updateMetrics(setThreatIntelCount, 10);
      if (mode === "ticket") updateMetrics(setTicketCount, 8);
    } catch (err) {
      setOutput("Error: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ background: "#0f172a", color: "white", minHeight: "100vh", padding: 40 }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>🛡️ Third Space Co-Pilot</h1>

      <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
        <button
          onClick={() => setSelectedTab("CoPilot")}
          style={{
            padding: "8px 16px",
            backgroundColor: selectedTab === "CoPilot" ? "#3b82f6" : "#1e293b",
            border: "none",
            color: "white",
            borderRadius: 6,
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
          }}
        >
          Phishing Detection
        </button>
        <button
          onClick={() => setSelectedTab("Integrations")}
          style={{
            padding: "8px 16px",
            backgroundColor: selectedTab === "Integrations" ? "#3b82f6" : "#1e293b",
            border: "none",
            color: "white",
            borderRadius: 6,
          }}
        >
          Integrations
        </button>
      </div>

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
                  }}
                >
                  {m.replace("-", " ").toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {mode === "kb" ? (
            <KnowledgeBase setKbCount={setKbCount} />
          ) : (
            <>
              <form onSubmit={handleSubmit}>
                <textarea
                  rows={6}
                  placeholder={`Paste your ${mode} input here...`}
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
                  }}
                >
                  {loading ? "Working..." : "Submit"}
                </button>
              </form>

              {output && (
                <div
                  style={{
                    marginTop: 40,
                    background: "#1e293b",
                    padding: 20,
                    borderRadius: 8,
                  }}
                >
                  <h3>🔍 Result:</h3>
                  <pre style={{ whiteSpace: "pre-wrap" }}>{output}</pre>
                  {["triage", "threat-intel"].includes(mode) && timeSavedMsg && (
                    <>
                      <p style={{ marginTop: 8, color: "#10b981" }}>{timeSavedMsg}</p>
                      <p style={{ fontSize: "0.9em", color: "#38bdf8", marginTop: "0.25rem" }}>
                        📊 Total Saved in {mode === "triage" ? "Triage" : "Threat Intel"} Mode: {((mode === "triage" ? triageCount * 6 : threatIntelCount * 10)).toFixed(1)} min • 💰 ~${(((mode === "triage" ? triageCount * 6 : threatIntelCount * 10)) * MINUTE_RATE).toFixed(0)}
                      </p>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}

      {selectedTab === "Phishing" && <PhishingDetection setPhishingCount={setPhishingCount} />}
      {selectedTab === "Integrations" && <Integrations />}

      <div
        style={{
          marginTop: 30,
          backgroundColor: "#0f172a",
          padding: 20,
          borderRadius: 8,
          border: "1px solid #334155",
        }}
      >
        <h3 style={{ fontSize: "1.2rem", marginBottom: 8 }}>📈 Global Impact</h3>
        <p style={{ color: "#10b981", fontWeight: "bold" }}>
          ⏱️ Total Time Saved: {totalGlobalTimeSaved.toFixed(1)} min
        </p>
        <p style={{ color: "#facc15", fontWeight: "bold" }}>
          💵 Estimated Value Saved: ${((totalGlobalTimeSaved * MINUTE_RATE).toFixed(0))}
        </p>
      </div>
    </div>
  );
}
