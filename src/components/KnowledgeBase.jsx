import { useState } from "react";
import axios from "axios";

export default function KnowledgeBase() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOutput("");

    try {
      const res = await axios.post("https://third-space-backend.onrender.com/api/kb", {
        question: input,
      });

      setOutput(res.data.result || "No response.");
    } catch (err) {
      console.error("KB tab error:", err.message);
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
        </div>
      )}
    </div>
  );
}
