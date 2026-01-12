import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // <--- IMPORT LINK
import { useStudy } from '../StudyContext';

const VideosPage = () => {
  const { data, videos, setVideos } = useStudy();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (data?.topic && videos.length === 0) {
      fetchVideos();
    }
  }, [data]);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            topic: data.topic,
            domain: data.domain || "General",
            level: data.level || "Beginner"
        })
      });
      const result = await res.json();
      if (result.videos) setVideos(result.videos);
      else setError("No videos found.");
    } catch (err) {
      setError("Failed to fetch videos.");
    }
    setLoading(false);
  };

  if (!data) return <div className="container mt-5">Please start a study session first.</div>;

  return (
    <div className="container mt-5 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h2 className="text-danger">Video Lectures: {data.topic}</h2>
            <small className="text-muted">Curated {data.level} level lectures for {data.domain}</small>
        </div>
        <button className="btn btn-outline-secondary btn-sm" onClick={fetchVideos}>
           ↻ Refresh
        </button>
      </div>

      {loading && <div className="text-center p-5"><div className="spinner-border text-danger"></div></div>}
      {error && <div className="alert alert-warning">{error}</div>}

      <div className="row">
        {videos.map((vid) => (
          <div key={vid.videoId} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="ratio ratio-16x9">
                <iframe src={`https://www.youtube.com/embed/${vid.videoId}`} title={vid.title} allowFullScreen></iframe>
              </div>
              <div className="card-body">
                <h6 className="card-title text-truncate" title={vid.title}>{vid.title}</h6>
                <p className="card-text small text-muted mb-1">By: {vid.channel}</p>
                <a href={`https://www.youtube.com/watch?v=${vid.videoId}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-danger mt-2">
                    Watch on YouTube ↗
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* NEW NAVIGATION BUTTONS */}
      <div className="d-flex justify-content-between mt-4">
        <Link to="/diagram" className="btn btn-secondary">&larr; Back to Visuals</Link>
        <Link to="/questions" className="btn btn-primary">Next: Questions &rarr;</Link>
      </div>

    </div>
  );
};

export default VideosPage;