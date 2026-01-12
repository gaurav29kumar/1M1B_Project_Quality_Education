import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStudy } from '../StudyContext';
import Latex from 'react-latex-next';

const QuestionsPage = () => {
  const { data, updateData } = useStudy();
  const [loadingMore, setLoadingMore] = useState(false);
  if (!data) return <div>No data.</div>;

  const handleShowMore = async () => {
    setLoadingMore(true);
    const res = await fetch("http://localhost:8000/more", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: data.topic, current_context: "", type: "questions" })
    });
    const json = await res.json();
    updateData("flashcards", json.new_data);
    setLoadingMore(false);
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="text-success border-bottom pb-2">Important Questions</h2>
      <div className="row mt-4">
        {data.flashcards.map((f, i) => (
            <div key={i} className="col-md-6 mb-3">
                <div className="card h-100 p-3 shadow-sm">
                    <h5 className="text-primary">Q: <Latex>{f.q}</Latex></h5>
                    <p className="text-muted border-top pt-2">A: <Latex>{f.a}</Latex></p>
                </div>
            </div>
        ))}
      </div>
      <div className="text-center mb-4">
        <button className="btn btn-outline-success" onClick={handleShowMore} disabled={loadingMore}>
            {loadingMore ? "Loading..." : "+ Load More Questions"}
        </button>
      </div>
      <div className="d-flex justify-content-between">
        <Link to="/diagram" className="btn btn-secondary">&larr; Back</Link>
        <Link to="/practice" className="btn btn-primary">Next: Practice &rarr;</Link>
      </div>
    </div>
  );
};
export default QuestionsPage;