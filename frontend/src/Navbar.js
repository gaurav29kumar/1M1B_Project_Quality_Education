import React from 'react';
import { NavLink } from 'react-router-dom';
import { useStudy } from './StudyContext';

const Navbar = () => {
  const { data } = useStudy();
  const linkClass = ({ isActive }) => `nav-link ${isActive ? "active fw-bold text-warning" : ""} ${!data ? "disabled" : ""}`;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow">
      <div className="container">
        <NavLink className="navbar-brand d-flex align-items-center" to="/">
           {/* Replace this with your actual logo file if you have one */}
           <img src="/logo.png" alt="Logo" width="40" height="40" className="me-2 rounded-circle border border-white" />
           
           {/* UPDATED APP NAME */}
           <span className="fw-bold">GEdu Learner</span>
        </NavLink>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><NavLink className={linkClass} to="/deep-dive">Deep Dive</NavLink></li>
            <li className="nav-item"><NavLink className={linkClass} to="/diagram">Visuals</NavLink></li>
            <li className="nav-item"><NavLink className={linkClass} to="/videos">Tutorials</NavLink></li>
            <li className="nav-item"><NavLink className={linkClass} to="/questions">Questions</NavLink></li>
            <li className="nav-item"><NavLink className={linkClass} to="/practice">Practice</NavLink></li>
            <li className="nav-item"><NavLink className={linkClass} to="/assignment">Assignment</NavLink></li>
            <li className="nav-item"><NavLink className={`btn btn-sm btn-outline-success ms-2 ${!data ? "disabled" : ""}`} to="/download">Download PDF</NavLink></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;