import { useState } from 'react';

export default function Knowledge() {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async (q) => {
    const query = q || question;
    if (!query.trim()) {
      setResult('⚠️ Please enter a security question.');
      return;
    }

    try {
      const res = await fetch('https://third-space-backend.onrender.com/api/kb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query }),
      });

      const data = await res.json();
      setResult(data.result || '❌ No response from AI.');
    } catch (error) {
      console.error("KB error:", error);
      setResult('❌ Could not fetch answer.');
    }
  };

  const suggestions = [
    "What is lateral movement?",
    "How does DNS tunneling work?",
    "What is zero trust architecture?",
  ];

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📚 Knowledge Base</h2>

      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="e.g. What is privilege escalation?"
        style={{ width: '300px', marginRight: '10px' }}
      />
      <button onClick={() => handleSubmit()}>Submit</button>

      <div style={{ marginTop: '1rem' }}>
        <strong>Suggested Questions:</strong>
        <ul>
          {suggestions.map((q, i) => (
            <li key={i} style={{ cursor: 'pointer', color: 'blue' }} onClick={() => handleSubmit(q)}>
              {q}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
        <strong>🧠 Answer:</strong>
        <p>{result}</p>
        {result && (
          <p style={{ fontSize: '0.85em', color: 'gray' }}>
            💡 AI-generated answer — verify before operational use.
          </p>
        )}
      </div>
    </div>
  );
}
