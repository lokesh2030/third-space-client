import { useState } from "react";
import Triage from "./components/Triage";
import PhishingDetection from "./components/phishing";

const BACKEND_URL = "https://third-space-backend.onrender.com";

export default function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("threat-intel"); // default non-triage mode
  const [selectedTab, setSelectedTab] = useState("CoPilot");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOutput("");

    const payload = mode === "threat-intel"
      ? { keyword: input }
      : mode === "ticket"
      ? { incident: input }
      : { question: input };

    try {
      const res = await fetch(`${BACKEND_URL}/api/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setOutput(data.result || "Something went wrong.");
    } catch (err) {
      setOutput("Error: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ background: "#0f172a", color: "white", minHeight: "100vh", padding: 40 }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>🛡️ Third Space Co-Pilot</h1>

      <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
        <button onClick={() => setSelectedTab("CoPilot")} style={{ backgroundColor: selectedTab === "CoPilot" ? "#3b82f6" : "#1e293b", color: "white", border: "none", borderRadius: 6, padding: "8px 16px" }}>
          Co-Pilot
        </button>
        <button onClick={() => setSelectedTab("Phishing")} style={{ backgroundColor: selectedTab === "Phishing" ? "#3b82f6" : "#1e293b", color: "white", border: "none", borderRadius: 6, padding: "8px 16px" }}>
          Phishing Detection
        </button>
      </div>

      {selectedTab === "CoPilot" && (
        <>
          <div style={{ marginBottom: 20 }}>
            <strong>Choose Mode:</strong>
            <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
              {["triage", "threat-intel", "ticket", "kb"].map((m) => (
                <button key={m} onClick={() => setMode(m)} style={{ backgroundColor: mode === m ? "#3b82f6" : "#1e293b", color: "white", border: "none", borderRadius: 6, padding: "8px 16px" }}>
                  {m.replace("-", " ").toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {mode === "triage" ? (
            <Triage />
          ) : (
            <>
              <form onSubmit={handleSubmit}>
                <textarea
                  rows={6}
                  placeholder={`Paste your ${mode} input here...`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  style={{ width: "100%", padding: 16, fontSize: 16, borderRadius: 6, marginBottom: 20 }}
                />
                <button type="submit" style={{ backgroundColor: "#3b82f6", color: "white", padding: "12px 24px", border: "none", borderRadius: 6 }}>
                  {loading ? "Working..." : "Submit"}
                </button>
              </form>
              {output && (
                <div style={{ marginTop: 40, background: "#1e293b", padding: 20, borderRadius: 8 }}>
                  <h3>🔍 Result:</h3>
                  <pre style={{ whiteSpace: "pre-wrap" }}>{output}</pre>
                </div>
              )}
            </>
          )}
        </>
      )}

      {selectedTab === "Phishing" && <PhishingDetection />}

      <div style={{ marginTop: 40, textAlign: "center", fontSize: 14, color: "#94a3b8" }}>
        © 2025 Third Space Security · All rights reserved
      </div>
    </div>
  );
}
