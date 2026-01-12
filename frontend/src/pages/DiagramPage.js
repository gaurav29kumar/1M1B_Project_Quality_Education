import React from 'react';
import { Link } from 'react-router-dom';
import { useStudy } from '../StudyContext';
import Mermaid from '../Mermaid';

const DiagramPage = () => {
  const { data } = useStudy();

  if (!data) return <div className="mt-5 text-center">No data found.</div>;

  return (
    <div className="container mt-5 mb-5">
      <h2 className="text-primary border-bottom pb-2">Visual Roadmap: {data.topic}</h2>
      
      <div className="mt-4 mb-4">
        {/* The Diagram Component */}
        <Mermaid chart={data.diagram} />
      </div>

      <div className="d-flex justify-content-between">
        <Link to="/deep-dive" className="btn btn-secondary">&larr; Back to Deep Dive</Link>
        
        {/* CHANGED THIS LINK TO POINT TO VIDEOS */}
        <Link to="/videos" className="btn btn-primary">Next: Tutorials &rarr;</Link>
      </div>
    </div>
  );
};

export default DiagramPage;