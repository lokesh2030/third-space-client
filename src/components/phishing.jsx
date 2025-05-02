import { useState } from "react";

export default function PhishingDetection() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    const start = Date.now(); // Start timer

    try {
      const res = await fetch("https://third-space-backend.onrender.com/api/phishing-detect/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const durationMs = Date.now() - start;
      console.log("⏱️ Phishing check completed in", durationMs / 1000, "seconds");

      // Optional: send to metrics API
      /*
      await fetch("https://third-space-backend.onrender.com/api/metrics/phishing-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          durationMs,
          timestamp: new Date().toISOString(),
          source: "phishing-tab",
        }),
      });
      */

      const data = await res.json();

      const lines = data.result.split("\n").filter(Boolean);
      const lowerResult = data.result.toLowerCase();

      const parsed = {
        suspicious:
          lowerResult.includes("suspicious: yes") ||
          lowerResult.includes("phishing") ||
          lowerResult.includes("fake") ||
          lowerResult.includes("not a legitimate") ||
          lowerResult.includes("red flag") ||
          lowerResult.includes("trick users")
            ? "Yes 🚨"
            : "No ✅",
        confidence: lines.find((line) => line.toLowerCase().includes("confidence"))?.split(":")[1]?.trim(),
        reason: lines.find((line) => line.toLowerCase().includes("reason"))?.split(":")[1]?.trim() || lines.slice(1).join(" "),
      };

      setResult(
        `Suspicious: ${parsed.suspicious}\nConfidence: ${parsed.confidence || "N/A"}\nReason: ${parsed.reason || "N/A"}`
      );
    } catch (err) {
      setResult("❌ Error checking phishing text.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Tagline */}
      <p style={{ marginBottom: 12, color: "#10b981", fontWeight: "bold" }}>
        ✅ Instantly detect suspicious emails missed by your filters.
      </p>

      {/* Textarea input */}
      <textarea
        rows={6}
        placeholder="Paste suspicious email text or link here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          width: "100%",
          padding: 16,
          fontSize: 16,
          borderRadius: 6,
          marginBottom: 20,
        }}
      />

      {/* Submit button */}
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
        {loading ? "Checking..." : "Check for Phishing"}
      </button>

      {/* Result output + value badge */}
      {result && (
        <div style={{ marginTop: 40, background: "#1e293b", padding: 20, borderRadius: 8 }}>
          <h3 style={{ marginBottom: 10 }}>🔍 Result:</h3>
          <pre style={{ whiteSpace: "pre-wrap", color: "white" }}>{result}</pre>

          <div style={{ marginTop: 10, fontSize: 14, color: "#10b981" }}>
            ⏱️ Saved ~5 min of manual triage • 🚀 90% faster than manual checks
          </div>
        </div>
      )}
    </form>
  );
}
