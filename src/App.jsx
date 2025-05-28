import Integrations from "./components/Integrations";
import { useState, useEffect } from "react";
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
    if (mode === "auto-triage") {
      const interval = setInterval(async () => {
        try {
          const res = await fetch(`${BACKEND_URL}/api/alerts/ingest`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              alert_id: `AUTO-${Date.now()}`,
              description: "CrowdStrike detected failed login attempts from suspicious IP 185.107.56.223.",
              source: "Auto Ingest",
              severity: "High",
            }),
          });

          const data = await res.json();
          const result = data.triageResult?.summary || "Something went wrong.";

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

          const savedMin = (6).toFixed(1);
          const percentFaster = ((6 * 60 - 15) / (6 * 60) * 100).toFixed(1);
          setTimeSavedMsg(`⏱️ Saved ~${savedMin} min • 🚀 ${percentFaster}% faster • 💵 This Run: ~$${(savedMin * MINUTE_RATE).toFixed(0)}`);
          setTriageCount((prev) => prev + 1);
        } catch (err) {
          setOutput("Error: " + err.message);
        }
      }, 10 * 60 * 1000); // 10 minutes
      return () => clearInterval(interval);
    }
  }, [mode]);

  return (
    <div style={{ background: "#0f172a", color: "white", minHeight: "100vh", padding: 40 }}>
      {/* ... rest of your UI remains unchanged ... */}
    </div>
  );
}
