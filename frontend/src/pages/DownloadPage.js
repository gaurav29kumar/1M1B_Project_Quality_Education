import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useStudy } from '../StudyContext';
import Latex from 'react-latex-next';
import Mermaid from '../Mermaid';
import html2pdf from 'html2pdf.js';

const DownloadPage = () => {
  const { data } = useStudy();
  const contentRef = useRef();
  
  const [options, setOptions] = useState({
    deep_dive: true,
    diagram: true,
    flashcards: true,
    practice: true,
    assignment: true
  });

  if (!data) return <div>No data.</div>;

  const handleDownload = () => {
    const element = contentRef.current;
    const opt = {
      margin: 0.5,
      filename: `${data.topic}_StudyPacket.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="text-center mb-4">Review & Download</h2>

      <div className="card p-3 mb-4 bg-light">
        <h5>Select content to include:</h5>
        <div className="d-flex flex-wrap gap-3">
            {Object.keys(options).map(key => (
                <div className="form-check" key={key}>
                    <input className="form-check-input" type="checkbox" checked={options[key]}
                        onChange={(e) => setOptions({...options, [key]: e.target.checked})}
                    />
                    <label className="form-check-label text-capitalize">{key.replace('_', ' ')}</label>
                </div>
            ))}
        </div>
        <button onClick={handleDownload} className="btn btn-success mt-3" style={{width: '200px'}}>Download PDF</button>
      </div>

      {/* Hidden Preview / Print Area */}
      <div className="border p-5 bg-white shadow-sm" style={{maxHeight: '500px', overflowY: 'auto'}}>
         <div ref={contentRef}>
            <h1 className="text-center text-primary mb-5">{data.topic} Study Guide</h1>

            {options.deep_dive && (
                <div className="mb-5">
                    <h3>Deep Dive</h3>
                    <p><Latex>{data.deep_dive.summary}</Latex></p>
                    <ul>{data.deep_dive.key_points.map((p,i)=><li key={i}><Latex>{p}</Latex></li>)}</ul>
                    <ul>{data.deep_dive.formulas.map((f,i)=><li key={i}><Latex>{f}</Latex></li>)}</ul>
                </div>
            )}

            {options.diagram && (
                <div className="mb-5 html2pdf__page-break">
                    <h3>Concept Map</h3>
                    <Mermaid chart={data.diagram} />
                </div>
            )}

            {options.flashcards && (
                <div className="mb-5">
                    <h3>Important Questions</h3>
                    {data.flashcards.map((f,i) => (
                        <div key={i} className="mb-2"><strong>Q: <Latex>{f.q}</Latex></strong><br/>A: <Latex>{f.a}</Latex></div>
                    ))}
                </div>
            )}

             {options.practice && (
                <div className="mb-5">
                    <h3>Practice</h3>
                    {data.practice.map((p,i) => <div key={i}>{i+1}. <Latex>{p.question}</Latex></div>)}
                </div>
            )}

            {options.assignment && (
                <div className="mb-5 html2pdf__page-break">
                    <h3>Assignment: {data.assignment.title}</h3>
                    <ul>{data.assignment.tasks.map((t,i) => <li key={i}><Latex>{t}</Latex></li>)}</ul>
                </div>
            )}
         </div>
      </div>

      <Link to="/" className="btn btn-outline-primary mt-4">Start New Topic</Link>
    </div>
  );
};
export default DownloadPage;