import Integrations from "./components/Integrations";
import { useState, useEffect } from "react";
import PhishingDetection from "./components/phishing";
import KnowledgeBase from "./components/KnowledgeBase";
const BACKEND_URL = "https://third-space-backend.onrender.com";

export default function App() {
  const [input, setInput] = useState("");
  const [decisionStatus, setDecisionStatus] = useState(null);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("triage");
  const [selectedTab, setSelectedTab] = useState("Security");
  const [timeSavedMsg, setTimeSavedMsg] = useState("");
  const [triageCount, setTriageCount] = useState(0);
  const [threatIntelCount, setThreatIntelCount] = useState(0);
  const [kbCount, setKbCount] = useState(0);
  const [ticketCount, setTicketCount] = useState(0);
  const [phishingCount, setPhishingCount] = useState(0);
  const [actionableCount, setActionableCount] = useState(0);
  const [nonActionableCount, setNonActionableCount] = useState(0);
  const [alertProcessedCount, setAlertProcessedCount] = useState(0);

  const totalGlobalTimeSaved =
    triageCount * 6 +
    threatIntelCount * 10 +
    kbCount * 5 +
    ticketCount * 8 +
    phishingCount * 3;

  const HOURLY_RATE = 75;
  const MINUTE_RATE = HOURLY_RATE / 60;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOutput("");
    setTimeSavedMsg("");

    const start = Date.now();

    let payload = {};
    let endpoint = "";

    if (mode === "triage") {
      payload = {
        alert_id: `ALERT-${Date.now()}`,
        description: input,
        source: "User Submitted",
        severity: "Medium",
      };
      endpoint = "alerts/ingest";
    } else if (mode === "threat-intel") {
      payload = { keyword: input };
      endpoint = "threat-intel";
    } else if (mode === "ticket") {
      payload = { incident: input };
      endpoint = "ticket";
    } else if (mode === "kb") {
      payload = { question: input };
      endpoint = "kb";
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const result =
        data.result ||
        data.triageResult?.summary ||
        "Something went wrong.";

      let ticketBlock = "";
      if (data.ticket) {
        ticketBlock = `\n\n🎫 Auto-Generated Ticket:\n${data.ticket}`;
      }

      let enrichmentBlock = "";
      if (data.triageResult?.enrichment?.length > 0) {
        enrichmentBlock = "\n\n🧠 Enrichment Data:\n" +
          data.triageResult.enrichment
            .map(
              (e) => `IP: ${e.ip}\nReputation: ${e.reputation}\nMalicious Votes: ${e.maliciousVotes}`
            )
            .join("\n\n");
      }

      setOutput(result + enrichmentBlock + ticketBlock);

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
      if (mode === "auto-triage") updateMetrics(setTriageCount, 6);
    } catch (err) {
      setOutput("Error: " + err.message);
    }

    setLoading(false);
  };
useEffect(() => {
  const handler = (e) => {
    if (e.key === "n" && mode === "auto-triage") {
      setAlertProcessedCount((prev) => prev + 1);
    }
  };
  document.addEventListener("keydown", handler);
  return () => document.removeEventListener("keydown", handler);
}, [mode]);

  useEffect(() => {
    if (mode === "auto-triage") {
      let intervalId;
      let currentIndex = 0;
      let loadedAlerts = [];

      fetch('/alerts-demo.json')
        .then(res => res.json())
        .then(data => {
          loadedAlerts = data;

          intervalId = setInterval(async () => {
            if (currentIndex >= loadedAlerts.length) {
              clearInterval(intervalId);
              setOutput("✅ All demo alerts have been processed.");
              return;
            }

            const alert = loadedAlerts[currentIndex];

            try {
              const res = await fetch(`${BACKEND_URL}/api/alerts/ingest`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(alert),
              });

              const data = await res.json();
              const result = data.triageResult?.summary || data.result || "Something went wrong.";

              let ticketBlock = "";
              if (data.ticket) {
                ticketBlock = `\n\n🎫 Auto-Generated Ticket:\n${data.ticket}`;
                setTicketCount(prev => prev + 1);
                setActionableCount(prev => prev + 1);
              } else {
                setNonActionableCount(prev => prev + 1);
              }

              let enrichmentBlock = "";
              if (data.triageResult?.enrichment?.length > 0) {
                enrichmentBlock = "\n\n🧠 Enrichment Data:\n" +
                  data.triageResult.enrichment
                    .map(
                      (e) => `IP: ${e.ip}\nReputation: ${e.reputation}\nMalicious Votes: ${e.maliciousVotes}`
                    )
                    .join("\n\n");
              }

              setOutput(`[${alert.alert_id}] ${result}${enrichmentBlock}${ticketBlock}`);
              setTriageCount((prev) => prev + 1);
              setAlertProcessedCount((prev) => prev + 1);
            } catch (err) {
              setOutput("Error: " + err.message);
            }

            currentIndex++;
          }, 86400000);
        });

      return () => clearInterval(intervalId);
    }
  }, [mode]);

  return (
    <div style={{ background: "#0f172a", color: "white", minHeight: "100vh", padding: 40 }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>🛡️ Third Space Security</h1>

      <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
        {["Security", "Phishing", "Integrations"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            style={{
              padding: "8px 16px",
              backgroundColor: selectedTab === tab ? "#3b82f6" : "#1e293b",
              border: "none",
              color: "white",
              borderRadius: 6,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {selectedTab === "Security" && (
        <>
          <div style={{ marginBottom: 20 }}>
            <strong>Choose Mode:</strong>
            <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
              {["triage", "threat-intel", "kb", "auto-triage"].map((m) => (
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
          ) : mode === "auto-triage" ? null : (
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
            </>
          )}

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
                  {/* 🛠️ Simulated Remediation Block */}
    <div style={{ marginTop: 20, padding: 16, backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: 6 }}>
      <p><strong>🔧 Suggested Fix:</strong> Block sender IP and isolate endpoint</p>
      <p><strong>🤖 Confidence:</strong> High</p>

      {!decisionStatus ? (
<div style={{ marginTop: 10, display: "flex", gap: 10 }}>
  <button
onClick={() => {
  setDecisionStatus("approved");
  if (mode === "auto-triage") {
    // Trigger next alert
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "n" }));
    setTimeout(() => setDecisionStatus(null), 100);
  }
}}

    style={{
      backgroundColor: "#16a34a",
      color: "white",
      padding: "8px 16px",
      border: "none",
      borderRadius: 6,
    }}
  >
    ✅ Approve
  </button>

  <button
onClick={() => {
  setDecisionStatus("rejected");
  if (mode === "auto-triage") {
    // Trigger next alert
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "n" }));
    setTimeout(() => setDecisionStatus(null), 100);
  }
}}

    style={{
      backgroundColor: "#dc2626",
      color: "white",
      padding: "8px 16px",
      border: "none",
      borderRadius: 6,
    }}
  >
    ❌ Reject
  </button>
</div>


      ) : (
        <p style={{ marginTop: 10, fontStyle: "italic", color: "#38bdf8" }}>
          You {decisionStatus} this remediation. Simulated execution complete ✅
        </p>
      )}
    </div>
              {timeSavedMsg && (
                <>
                  <p style={{ marginTop: 8, color: "#10b981" }}>{timeSavedMsg}</p>
                  <p style={{ fontSize: "0.9em", color: "#38bdf8", marginTop: "0.25rem" }}>
                    📊 Total Saved in {mode.replace("-", " ").toUpperCase()} Mode: {((mode === "triage" ? triageCount * 6 : mode === "threat-intel" ? threatIntelCount * 10 : triageCount * 6)).toFixed(1)} min • 💰 ~${(((mode === "triage" ? triageCount * 6 : mode === "threat-intel" ? threatIntelCount * 10 : triageCount * 6)) * MINUTE_RATE).toFixed(0)}
                  </p>
                </>
              )}
            </div>
          )}
        </>
      )}

      {selectedTab === "Phishing" && <PhishingDetection setPhishingCount={setPhishingCount} />}
      {selectedTab === "Integrations" && <Integrations />}

      {mode === "auto-triage" && alertProcessedCount >= 250 && (
        <div
          style={{
            marginTop: 30,
            backgroundColor: "#1e293b",
            padding: 20,
            borderRadius: 8,
            border: "1px solid #334155",
          }}
        >
          <h3 style={{ fontSize: "1.2rem", marginBottom: 10 }}>📊 Demo Summary</h3>
          <p>✅ Actionable Alerts: {actionableCount}</p>
          <p>💤 Non-Actionable Alerts: {nonActionableCount}</p>
          <p>📦 Total Alerts Processed: {alertProcessedCount}</p>
        </div>
      )}

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
