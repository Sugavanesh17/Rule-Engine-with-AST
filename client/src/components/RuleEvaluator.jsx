import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import TreeVisualizer from "./TreeVisualizer";

const RuleEvaluator = () => {
  const [rules, setRules] = useState([]);
  const [selectedRules, setSelectedRules] = useState([]);
  const [data, setData] = useState({
    age: "",
    department: "",
    salary: "",
    experience: "",
  });
  const [results, setResults] = useState(null);
  const [evaluationHistory, setEvaluationHistory] = useState([]);

  const testCases = [
    {
      age: 35,
      department: "Sales",
      salary: 60000,
      experience: 3,
    },
    {
      age: 24,
      department: "Marketing",
      salary: 55000,
      experience: 2,
    },
    {
      age: 28,
      department: "Engineering",
      salary: 45000,
      experience: 4,
    },
  ];

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/rules");
      setRules(response.data);
    } catch (error) {
      toast.error("Error fetching rules");
    }
  };

  const handleEvaluate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/rules/evaluate",
        {
          data,
          ruleIds: selectedRules,
        }
      );
      setResults(response.data.results);
      setEvaluationHistory((prev) => [
        ...prev,
        { data: { ...data }, results: response.data.results },
      ]);
    } catch (error) {
      toast.error(error.response?.data?.error || "Error evaluating rules");
    }
  };

  const runTestCase = async (testData) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/rules/evaluate",
        {
          data: testData,
          ruleIds: selectedRules,
        }
      );
      return response.data.results;
    } catch (error) {
      toast.error(`Error evaluating test case: ${error.message}`);
    }
  };

  const runAllTests = async () => {
    if (!selectedRules.length) {
      toast.error("Please select rules to test");
      return;
    }

    const allResults = [];
    for (const testCase of testCases) {
      const results = await runTestCase(testCase);
      allResults.push({ testCase, results });
    }
    setResults(allResults.flatMap((r) => r.results));
    setEvaluationHistory((prev) => [...prev, ...allResults]);
  };

  return (
    <div className="container">
      <div className="card shadow">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Evaluate Rules</h2>
          <form onSubmit={handleEvaluate}>
            <div className="mb-3">
              <label className="form-label">Select Rules to Evaluate</label>
              <select
                multiple
                className="form-select"
                value={selectedRules}
                onChange={(e) =>
                  setSelectedRules(
                    Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    )
                  )
                }
              >
                {rules.map((rule) => (
                  <option key={rule._id} value={rule._id}>
                    {rule.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-control"
                  value={data.age}
                  onChange={(e) => setData({ ...data, age: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Department</label>
                <select
                  className="form-select"
                  value={data.department}
                  onChange={(e) =>
                    setData({ ...data, department: e.target.value })
                  }
                >
                  <option value="">Select Department</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Engineering">Engineering</option>
                </select>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Salary</label>
                <input
                  type="number"
                  className="form-control"
                  value={data.salary}
                  onChange={(e) => setData({ ...data, salary: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Experience (years)</label>
                <input
                  type="number"
                  className="form-control"
                  value={data.experience}
                  onChange={(e) =>
                    setData({ ...data, experience: e.target.value })
                  }
                />
              </div>
            </div>

            <button type="submit" className="btn btn-success w-100 mb-3">
              Evaluate Rules
            </button>
          </form>

          <button onClick={runAllTests} className="btn btn-primary w-100">
            Run Test Cases
          </button>

          {results && (
            <div className="mt-4">
              <h3>Results:</h3>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Rule Name</th>
                      <th>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result) => (
                      <tr key={result.ruleId}>
                        <td>{result.ruleName}</td>
                        <td>
                          <span
                            className={`badge ${
                              result.result ? "bg-success" : "bg-danger"
                            }`}
                          >
                            {result.result ? "Pass" : "Fail"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {evaluationHistory.length > 0 && (
            <div className="mt-4">
              <h3>Evaluation History:</h3>
              {evaluationHistory.map((entry, index) => (
                <div key={index} className="card mb-2">
                  <div className="card-body">
                    <h6>Test Data:</h6>
                    <pre>{JSON.stringify(entry.data, null, 2)}</pre>
                    <h6>Results:</h6>
                    {entry.results.map((result) => (
                      <div key={result.ruleId}>
                        {result.ruleName}: {result.result ? "Pass" : "Fail"}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RuleEvaluator;
