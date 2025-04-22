import { useState } from "react";
import { FaBug, FaBrain, FaBook, FaTicketAlt, FaSearch } from "react-icons/fa";

const tabs = [
  { name: "Triage", icon: <FaBug /> },
  { name: "Threat Intel", icon: <FaBrain /> },
  { name: "Knowledge Base", icon: <FaBook /> },
  { name: "Ticketing", icon: <FaTicketAlt /> },
  { name: "CVE Lookup", icon: <FaSearch /> },
];

const BACKEND_URL = "https://third-space-backend.onrender.com";

export default function App() {
  const [activeTab, setActiveTab] = useState("Triage");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setOutput("");

    if (!input.trim()) {
      setError("Please enter something.");
      return;
    }

    setLoading(true);

    try {
      if (activeTab === "CVE Lookup") {
        const res = await fetch(`${BACKEND_URL}/api/cve-info?cve_id=${input}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        setOutput(data.summary || "No summary available.");
      } else {
        setOutput(`🔧 Simulating "${activeTab}" with input: "${input}"`);
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans px-4 py-6">
      <h1 className="text-4xl font-bold text-center mb-8">Third Space Copilot</h1>

      <div className="flex justify-center flex-wrap gap-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => {
              setActiveTab(tab.name);
              setInput("");
              setOutput("");
              setError("");
            }}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-lg transition-all ${
              activeTab === tab.name
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white border border-blue-300 text-blue-600 hover:bg-blue-50"
            }`}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>

      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">{activeTab}</h2>

        <input
          type="text"
          className="w-full border border-gray-300 p-3 rounded mb-4"
          placeholder={`Enter input for ${activeTab}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Working..." : "Submit"}
        </button>

        {error && <p className="text-red-600 mt-4">{error}</p>}
        {output && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
            <strong>Output:</strong>
            <p>{output}</p>
          </div>
        )}
      </div>
    </div>
  );
}
