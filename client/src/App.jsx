import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import RuleManager from "./components/RuleManager";
import RuleEditor from "./components/RuleEditor";
import RuleEvaluator from "./components/RuleEvaluator";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import RuleCombiner from "./components/RuleCombiner";
import RuleModifier from "./components/RuleModifier";

const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    <div className="container-fluid">
      <Link to="/" className="navbar-brand">
        RuleEngine
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
          <li className="nav-item">
            <Link to="/modify" className="nav-link">
              Modify Rules
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

const Dashboard = () => (
  <div className="container mt-4">
    <h1 className="text-center mb-4">DashBoard</h1>
    <div className="row">
      <div className="col-lg-6 mb-4">
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
      <div className="col-lg-6 mb-4">
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
      <div className="col-lg-6 mb-4">
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
      <div className="col-lg-6 mb-4">
        <div className="card shadow">
          <div className="card-body text-center">
            <h2 className="card-title">Rule Modifying</h2>
            <p className="card-text">Modify an existing rule</p>
            <Link to="/modify" className="btn btn-success">
              Modify Rules →
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
            <Route path="/modify" element={<RuleModifier />} />
          </Routes>
        </main>
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
};

export default App;
