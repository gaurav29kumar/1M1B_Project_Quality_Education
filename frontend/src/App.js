import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { StudyProvider } from "./StudyContext";


import "katex/dist/katex.min.css";

import Navbar from "./Navbar";
import Home from "./pages/Home";
import DeepDive from "./pages/DeepDive";
import DiagramPage from "./pages/DiagramPage";
import QuestionsPage from "./pages/QuestionsPage";
import PracticePage from "./pages/PracticePage";
import AssignmentPage from "./pages/AssignmentPage";
import DownloadPage from "./pages/DownloadPage";
import VideosPage from "./pages/VideosPage";

function App() {
  return (
    <StudyProvider>
      <Router>
        <Navbar />
        <div className="container">
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/deep-dive" element={<DeepDive />} />
            <Route path="/diagram" element={<DiagramPage />} />
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/questions" element={<QuestionsPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/assignment" element={<AssignmentPage />} />
            <Route path="/download" element={<DownloadPage />} />
            </Routes>
        </div>
      </Router>
    </StudyProvider>
  );
}
export default App;