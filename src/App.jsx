import { useState } from 'react'

function App() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")

  return (
    <div style={{ padding: 30, fontFamily: "Arial", background: "#0f172a", color: "white", minHeight: "100vh" }}>
      <h1>🛡️ Third Space Co-Pilot</h1>
      <textarea
        rows="6"
        placeholder="Paste a security alert, question, or incident..."
        value={input}
        onChange={e => setInput(e.target.value)}
        style={{ width: "100%", marginTop: 20, padding: 10, fontSize: 16 }}
      />
      <button
        onClick={() => setOutput("← This will be powered by the backend later")}
        style={{ marginTop: 20, padding: "10px 20px", fontSize: 16, backgroundColor: "#3b82f6", border: "none", color: "white", cursor: "pointer" }}
      >
        Submit
      </button>
      <pre style={{ marginTop: 30 }}>{output}</pre>
    </div>
  )
}

export default App
