import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStudy } from '../StudyContext';
import Latex from 'react-latex-next';

const AssignmentPage = () => {
  const { data, updateData } = useStudy();
  const [loadingMore, setLoadingMore] = useState(false);
  if (!data) return <div>No data.</div>;

  const handleShowMore = async () => {
    setLoadingMore(true);
    const res = await fetch("http://localhost:8000/more", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: data.topic, current_context: "", type: "assignment" })
    });
    const json = await res.json();
    updateData("assignment", json.new_data);
    setLoadingMore(false);
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="text-danger border-bottom pb-2">Assignment</h2>
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-danger text-white">
            <h5 className="mb-0">{data.assignment.title || "Topic Assignment"}</h5>
        </div>
        <div className="card-body">
            <ul className="list-group list-group-flush">
                {data.assignment.tasks.map((task, i) => (
                    <li key={i} className="list-group-item">
                        <input type="checkbox" className="form-check-input me-2" />
                        <Latex>{task}</Latex>
                    </li>
                ))}
            </ul>
        </div>
      </div>
      <div className="text-center mb-4">
        <button className="btn btn-outline-danger" onClick={handleShowMore} disabled={loadingMore}>
            {loadingMore ? "Loading..." : "+ Add More Tasks"}
        </button>
      </div>
      <div className="d-flex justify-content-between">
        <Link to="/practice" className="btn btn-secondary">&larr; Back</Link>
        <Link to="/download" className="btn btn-success">Finish & Download &rarr;</Link>
      </div>
    </div>
  );
};
export default AssignmentPage;