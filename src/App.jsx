import { useState } from "react";

const BACKEND_URL = "https://third-space-backend.onrender.com";

function App() {
  const [cveId, setCveId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLookup = async () => {
    if (!cveId) {
      setError("Please enter a CVE ID.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`${BACKEND_URL}/api/cve-info?cve_id=${cveId}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to fetch CVE info.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Third Space — CVE Lookup</h1>

      <input
        type="text"
        value={cveId}
        onChange={(e) => setCveId(e.target.value)}
        placeholder="Enter CVE ID (e.g., CVE-2019-9134)"
        className="border border-gray-400 p-2 w-full mb-4 rounded"
      />

      <button
        onClick={handleLookup}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Looking up..." : "Lookup"}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <p><strong>CVE ID:</strong> {result.cve_id}</p>
          <p><strong>CVSS:</strong> {result.cvss}</p>
          <p><strong>Description:</strong> {result.description}</p>
          <p className="mt-2"><strong>AI Summary:</strong></p>
          <p>{result.summary}</p>
          {result.references && result.references.length > 0 && (
            <div className="mt-4">
              <p><strong>References:</strong></p>
              <ul className="list-disc list-inside">
                {result.references.map((ref, i) => (
                  <li key={i}>
                    <a href={ref} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                      {ref}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
