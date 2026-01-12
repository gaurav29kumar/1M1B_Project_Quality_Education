import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStudy } from '../StudyContext';
import Latex from 'react-latex-next';

const DeepDive = () => {
  const { data, updateData } = useStudy();
  const [loadingMore, setLoadingMore] = useState(false);

  if (!data) return <div className="text-center mt-5">No data. <Link to="/">Go Home</Link></div>;

  // SAFETY: Handle missing deep_dive gracefully
  const summary = data.deep_dive?.summary || "Summary not available.";
  const keyPoints = data.deep_dive?.key_points || [];
  const formulas = data.deep_dive?.formulas || [];

  const handleShowMore = async () => {
    setLoadingMore(true);
    try {
        const res = await fetch("http://localhost:8000/more", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topic: data.topic, current_context: summary, type: "deep_dive" })
        });
        const json = await res.json();
        updateData("deep_dive", json.new_content);
    } catch (e) { console.error(e); }
    setLoadingMore(false);
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="text-primary border-bottom pb-2">Deep Dive: {data.topic}</h2>
      <div className="bg-light p-4 rounded mb-4">
        <h4>Summary</h4>
        <p style={{whiteSpace: 'pre-line'}}><Latex>{summary}</Latex></p>
        <button className="btn btn-sm btn-outline-primary" onClick={handleShowMore} disabled={loadingMore}>
            {loadingMore ? "Loading..." : "+ Show More Details"}
        </button>
        <h4 className="mt-4">Key Points</h4>
        <ul>{keyPoints.map((p, i) => <li key={i}><Latex>{p}</Latex></li>)}</ul>
        <h4 className="mt-4">Formulas</h4>
        <ul>{formulas.map((f, i) => <li key={i}><Latex>{f}</Latex></li>)}</ul>
      </div>
      <div className="d-flex justify-content-between">
        <Link to="/" className="btn btn-secondary">Back</Link>
        <Link to="/diagram" className="btn btn-primary">Next: Visuals &rarr;</Link>
      </div>
    </div>
  );
};
export default DeepDive;