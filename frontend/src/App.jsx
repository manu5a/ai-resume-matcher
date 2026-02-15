import { useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

export default function App() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [error, setError] = useState("");

  async function handleMatch() {
    setError("");
    setScore(null);

    if (!resume.trim() || !jd.trim()) {
      setError("Paste both Resume text and Job Description.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume_text: resume, job_description: jd }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API error ${res.status}: ${text}`);
      }

      const data = await res.json();
      setScore(data.match_score);
    } catch (e) {
      setError(e.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }

  function loadSample() {
    setResume(
      "Python developer with experience building FastAPI REST APIs, basic machine learning, NLP, and data analysis. Comfortable with Git and Docker."
    );
    setJd(
      "We are hiring a Python engineer to build backend APIs. Nice to have: ML/NLP experience, data processing, and familiarity with deployment."
    );
    setError("");
    setScore(null);
  }

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ marginBottom: 6 }}>AI Resume Matcher — Live Demo</h1>
      <p style={{ marginTop: 0, color: "#444" }}>
        This demo calls a FastAPI backend and returns a TF-IDF cosine similarity match score.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={{ fontWeight: 700 }}>Resume text</label>
          <textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            rows={14}
            style={{ width: "100%", marginTop: 6, padding: 10 }}
            placeholder="Paste resume text here..."
          />
        </div>

        <div>
          <label style={{ fontWeight: 700 }}>Job description</label>
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            rows={14}
            style={{ width: "100%", marginTop: 6, padding: 10 }}
            placeholder="Paste job description here..."
          />
        </div>
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center" }}>
        <button
          onClick={handleMatch}
          disabled={loading}
          style={{ padding: "10px 14px", fontWeight: 800, cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Matching..." : "Get Match Score"}
        </button>

        <button
          onClick={loadSample}
          style={{ padding: "10px 14px", cursor: "pointer" }}
        >
          Load sample
        </button>
      </div>

      {error ? (
        <div style={{ marginTop: 12, color: "crimson", fontWeight: 700 }}>{error}</div>
      ) : null}

      {score !== null ? (
        <div style={{ marginTop: 16, padding: 14, border: "1px solid #ddd", borderRadius: 8 }}>
          <div style={{ fontSize: 18, fontWeight: 900 }}>Match score: {score} / 100</div>
          <div style={{ marginTop: 6, color: "#555" }}>
            Higher score means closer similarity between resume and job description text.
          </div>
        </div>
      ) : null}

      <div style={{ marginTop: 18, color: "#666", fontSize: 13 }}>
        Next: deploy backend + frontend and replace API_BASE with the deployed backend URL.
      </div>
    </div>
  );
}
