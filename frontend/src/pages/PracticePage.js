import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStudy } from '../StudyContext';
import Latex from 'react-latex-next';

const PracticePage = () => {
  const { data, updateData } = useStudy();
  const [loadingMore, setLoadingMore] = useState(false);
  if (!data) return <div>No data.</div>;

  const handleShowMore = async () => {
    setLoadingMore(true);
    const res = await fetch("http://localhost:8000/more", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: data.topic, current_context: "", type: "practice" })
    });
    const json = await res.json();
    updateData("practice", json.new_data);
    setLoadingMore(false);
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="text-warning border-bottom pb-2">Practice Problems</h2>
      <ul className="list-group list-group-flush mb-4">
        {data.practice.map((p, i) => (
            <li key={i} className="list-group-item">
                <span className="badge bg-secondary me-2">{i+1}</span>
                <Latex>{p.question}</Latex>
            </li>
        ))}
      </ul>
      <div className="text-center mb-4">
        <button className="btn btn-outline-warning" onClick={handleShowMore} disabled={loadingMore}>
            {loadingMore ? "Loading..." : "+ Load More Problems"}
        </button>
      </div>
      <div className="d-flex justify-content-between">
        <Link to="/questions" className="btn btn-secondary">&larr; Back</Link>
        <Link to="/assignment" className="btn btn-primary">Next: Assignment &rarr;</Link>
      </div>
    </div>
  );
};
export default PracticePage;