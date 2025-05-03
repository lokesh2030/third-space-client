import { useState } from "react";
import PhishingDetection from "./components/phishing";
import Triage from "./components/Triage";

const BACKEND_URL = "https://third-space-backend.onrender.com";

export default function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("triage");
  const [selectedTab, setSelectedTab] = useState("CoPilot");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOutput("");

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

      {/* Co-Pilot Tab */}
      {selectedTab === "CoPilot" && <Triage />}

      {/* Phishing Tab */}
      {selectedTab === "Phishing" && <PhishingDetection />}

      {/* Footer */}
      <div style={{ marginTop: 40, textAlign: "center", fontSize: 14, color: "#10b981" }}>
        ⏱️ Estimated savings shown dynamically in Triage tab
      </div>
      <div style={{ marginTop: 10, textAlign: "center", fontSize: 14, color: "#94a3b8" }}>
        © 2025 Third Space Security · All rights reserved
      </div>
    </div>
  );
}
