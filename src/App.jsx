import { useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("triage");

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setOutput("");

  let payload = {};
  if (mode === "triage") payload = { alert: input };
  else if (mode === "threat-intel") payload = { keyword: input };
  else if (mode === "ticket") payload = { incident: input };
  else if (mode === "kb") payload = { question: input };

  const res = await fetch(`${BACKEND_URL}/api/${mode}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  setOutput(data.result || "Something went wrong.");
  setLoading(false);
};


    const res = await fetch(`${BACKEND_URL}/api/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        alert: input,
        keyword: input,
        incident: input,
        question: input,
      }),
    });

    const data = await res.json();
    setOutput(data.result || "Something went wrong.");
    setLoading(false);
  };

  return (
    <div style={{ background: "#0f172a", color: "white", minHeight: "100vh", padding: 40, fontFamily: "Arial" }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>🛡️ Third Space Co-Pilot</h1>

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
          placeholder={`Paste your ${mode === "triage" ? "alert" : mode === "ticket" ? "incident" : mode === "kb" ? "question" : "keyword"} here...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: "100%", padding: 16, fontSize: 16, borderRadius: 6, marginBottom: 20 }}
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
        </div>
      )}
    </div>
  );
}

