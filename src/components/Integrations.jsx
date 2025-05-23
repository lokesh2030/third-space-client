import React from "react";

export default function Integrations() {
  const integrations = [
    {
      name: "Microsoft 365",
      status: "Coming Soon",
      description: "Analyze phishing emails and Defender alerts from M365.",
      logo: "https://img.icons8.com/color/48/microsoft.png",
    },
    {
      name: "Jira Service Management",
      status: "Connect",
      description: "Send triage and phishing incidents directly to Jira.",
      logo: "https://img.icons8.com/color/48/jira.png",
      onClick: () => alert("✅ Connected to Jira! Triage outputs will now route to your queue."),
    },
    {
      name: "Slack",
      status: "Connect",
      description: "Route high-risk alerts to a Slack channel.",
      logo: "https://img.icons8.com/color/48/slack-new.png",
      onClick: () => alert("✅ Slack connected! Alerts will be sent to #security-alerts."),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>🔗 Integrations</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {integrations.map((item) => (
          <div
            key={item.name}
            style={{
              backgroundColor: "#1e293b",
              padding: 20,
              borderRadius: 10,
              width: 300,
              border: "1px solid #334155",
            }}
          >
            <img src={item.logo} alt={item.name} style={{ height: 40, marginBottom: 10 }} />
            <h3 style={{ color: "#f8fafc", marginBottom: 10 }}>{item.name}</h3>
            <p style={{ color: "#cbd5e1", fontSize: 14 }}>{item.description}</p>
            <button
              onClick={item.onClick}
              disabled={item.status !== "Connect"}
              style={{
                marginTop: 12,
                backgroundColor: item.status === "Connect" ? "#3b82f6" : "#64748b",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: 6,
                cursor: item.status === "Connect" ? "pointer" : "not-allowed",
              }}
            >
              {item.status}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
