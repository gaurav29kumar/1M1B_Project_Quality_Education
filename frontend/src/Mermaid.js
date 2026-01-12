import React, { useEffect, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
  logLevel: 5
});

const Mermaid = ({ chart }) => {
  const [svg, setSvg] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!chart) return;

    let cleanChart = chart
      .replace(/`/g, "")
      .replace(/mermaid/g, "")
      .trim();

    const renderDiagram = async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, cleanChart);
        
        // HACK: Force SVG to be 100% width and responsive height
        const responsiveSvg = svg
            .replace(/width="[0-9%px]*"/, 'width="100%"')
            .replace(/height="[0-9%px]*"/, 'height="auto"')
            .replace(/max-width:[^;]*;/g, 'max-width: none;'); // Remove max-width limits

        setSvg(responsiveSvg);
        setError(null);
      } catch (err) {
        console.error("Mermaid Render Failed:", err);
        setError("Diagram syntax error (AI generated invalid code). Try regenerating.");
      }
    };

    renderDiagram();
  }, [chart]);

  if (error) {
    return <div className="alert alert-warning text-center">{error}</div>;
  }

  // Container styling to ensure it takes full space
  return (
    <div 
      className="mermaid-container border rounded p-3 bg-white shadow-sm"
      style={{ 
        width: "100%", 
        overflowX: "auto", // Adds scrollbar if it's REALLY massive
        textAlign: "center",
        minHeight: "400px", // Ensures it doesn't look squashed vertically
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }} 
      dangerouslySetInnerHTML={{ __html: svg }} 
    />
  );
};

export default Mermaid;