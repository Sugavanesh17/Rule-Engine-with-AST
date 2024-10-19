import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import RuleManager from "./components/RuleManager";
import RuleEditor from "./components/RuleEditor";
import RuleEvaluator from "./components/RuleEvaluator";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import RuleCombiner from "./components/RuleCombiner";

const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    <div className="container-fluid">
      <Link to="/" className="navbar-brand">
        Rule Engine
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          {/*<li className="nav-item">
            <Link to="/rules" className="nav-link">
              Manage Rules
            </Link>
          </li>*/}
          <li className="nav-item">
            <Link to="/create" className="nav-link">
              Create Rule
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/evaluate" className="nav-link">
              Evaluate Rules
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/combine" className="nav-link">
              Combine Rules
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

const Dashboard = () => (
  <div className="container mt-4">
    <h1 className="text-center mb-4">Rule Engine Dashboard</h1>
    <div className="row">
      {/*<div className="col-lg-4 mb-4">
        <div className="card shadow">
          <div className="card-body text-center">
            <h2 className="card-title">Active Rules</h2>
            <p className="card-text">View and manage your business rules.</p>
            <Link to="/rules" className="btn btn-success">
              Manage Rules →
            </Link>
          </div>
        </div>
      </div>*/}
      <div className="col-lg-4 mb-4">
        <div className="card shadow">
          <div className="card-body text-center">
            <h2 className="card-title">Rule Creation</h2>
            <p className="card-text">Create new business rules.</p>
            <Link to="/create" className="btn btn-success">
              Create Rule →
            </Link>
          </div>
        </div>
      </div>
      <div className="col-lg-4 mb-4">
        <div className="card shadow">
          <div className="card-body text-center">
            <h2 className="card-title">Rule Evaluation</h2>
            <p className="card-text">Test your rules with sample data.</p>
            <Link to="/evaluate" className="btn btn-success">
              Evaluate Rules →
            </Link>
          </div>
        </div>
      </div>
      <div className="col-lg-4 mb-4">
        <div className="card shadow">
          <div className="card-body text-center">
            <h2 className="card-title">Rule Combining</h2>
            <p className="card-text">Combine mutiple rules</p>
            <Link to="/combine" className="btn btn-success">
              Combine Rules →
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-vh-100 bg-light">
        <Navbar />
        <main className="container mt-4 mb-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/rules" element={<RuleManager mode="manage" />} />
            <Route path="/evaluate" element={<RuleEvaluator />} />
            <Route path="/create" element={<RuleEditor />} />
            <Route path="/combine" element={<RuleCombiner />} />
          </Routes>
        </main>
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
};

export default App;
