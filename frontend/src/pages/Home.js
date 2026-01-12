import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudy } from '../StudyContext';

const Home = () => {
  const [topic, setTopic] = useState("");
  const [domain, setDomain] = useState("General");
  // Default to a common education level
  const [level, setLevel] = useState("Undergraduate"); 
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  
  const { setData, setLoading: setGlobalLoading } = useStudy();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGlobalLoading(true);

    try {
      // We still send it as 'level' to the backend, but the value is now "Undergraduate", etc.
      const res = await fetch("http://localhost:8000/study", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, domain, level, language })
      });
      
      const result = await res.json();
      setData({ ...result, topic, domain, level });
      navigate("/deep-dive");
    } catch (error) {
      console.error("Error:", error);
      alert("Backend connection failed. Is the server running?");
    }
    setLoading(false);
    setGlobalLoading(false);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5"> 
          <div className="card shadow-lg border-0 rounded-4" style={{ textAlign: 'left' }}> 
            <div className="card-body p-5">
              
              <div className="text-center mb-4">
                <img src="/logo.png" alt="Logo" width="40" height="40" className="me-2 rounded-circle border border-white" />
           
           {/* NEW APP NAME */}
           <span className="fw-bold">GEdu Learn</span>
                <h1 className="text-primary fw-bold">AI Tutor</h1>
                <p className="text-muted">Generate a personalized study plan</p>
              </div>
              
              <form onSubmit={handleSubmit} style={{ display: 'block', width: '100%' }}>
                
                {/* 1. TOPIC */}
                <div className="mb-3">
                  <label className="form-label fw-bold d-block">Topic</label>
                  <input 
                    type="text" 
                    className="form-control form-control-lg bg-light" 
                    style={{ width: '100%', display: 'block' }}
                    placeholder="e.g. Thermodynamics" 
                    value={topic} 
                    onChange={(e) => setTopic(e.target.value)} 
                    required 
                  />
                </div>

                {/* 2. DOMAIN */}
                <div className="mb-3">
                    <label className="form-label fw-bold small text-muted d-block">Domain / Field</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        style={{ width: '100%', display: 'block' }}
                        placeholder="e.g. Physics, Computer Science" 
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                    />
                </div>

                {/* 3. EDUCATION LEVEL (Renamed) */}
                <div className="mb-3">
                    <label className="form-label fw-bold small text-muted d-block">Standard / Education Level</label>
                    <select 
                        className="form-select" 
                        style={{ width: '100%', display: 'block' }}
                        value={level} 
                        onChange={(e) => setLevel(e.target.value)}
                    >
                        <option>High School (9th - 10th)</option>
                        <option>High School (11th - 12th)</option>
                        <option>Undergraduate (College)</option>
                        <option>Postgraduate (Masters/PhD)</option>
                        <option>Professional / Research</option>
                    </select>
                </div>

                {/* 4. LANGUAGE */}
                <div className="mb-4">
                     <label className="form-label fw-bold small text-muted d-block">Language</label>
                     <select 
                        className="form-select" 
                        style={{ width: '100%', display: 'block' }}
                        value={language} 
                        onChange={(e) => setLanguage(e.target.value)}
                    >
                        <option>English</option>
                        <option>Hindi</option>
                        <option>Spanish</option>
                        <option>French</option>
                    </select>
                </div>

                {/* 5. BUTTON */}
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 btn-lg py-3 fw-bold shadow-sm"
                  style={{ display: 'block' }} 
                  disabled={loading}
                >
                  {loading ? "Generating Plan..." : "Start Learning 🚀"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;