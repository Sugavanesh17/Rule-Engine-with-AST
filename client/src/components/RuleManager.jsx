import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const RuleManager = () => {
  const [rules, setRules] = useState([]);
  const [newRule, setNewRule] = useState({ name: "", ruleString: "" });
  const [testData, setTestData] = useState({
    age: "",
    department: "",
    salary: "",
    experience: "",
  });
  const [evaluationResults, setEvaluationResults] = useState([]);

  const createRule = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/rules", newRule);
      setRules([...rules, response.data]);
      setNewRule({ name: "", ruleString: "" });
    } catch (error) {
      console.error("Error creating rule:", error);
    }
  };

  const evaluateRules = async () => {
    try {
      const response = await axios.post("/api/rules/evaluate", {
        data: testData,
        ruleIds: rules.map((r) => r._id),
      });
      setEvaluationResults(response.data.results);
    } catch (error) {
      console.error("Error evaluating rules:", error);
    }
  };

  return (
    <div className="justify-content-center text-center align-items-center">
      <div className="container d-flex flex-column align-items-center">
        <h1 className="text-center mb-4">Rule Engine Manager</h1>

        {/* Rule Creation Form */}
        <form id="create" onSubmit={createRule} className="w-50 mb-5">
          <h2 className="h5 text-center mb-3">Create Rule</h2>
          <div className="row g-2">
            <div className="col">
              <input
                type="text"
                placeholder="Rule Name"
                value={newRule.name}
                onChange={(e) =>
                  setNewRule({ ...newRule, name: e.target.value })
                }
                className="form-control"
              />
            </div>
            <div className="col">
              <input
                type="text"
                placeholder="Rule String"
                value={newRule.ruleString}
                onChange={(e) =>
                  setNewRule({ ...newRule, ruleString: e.target.value })
                }
                className="form-control"
              />
            </div>
            <div className="col-auto">
              <button type="submit" className="btn btn-success">
                Create Rule
              </button>
            </div>
          </div>
        </form>

        {/* Test Data Form */}
        <div id="test-data" className="w-50 mb-5">
          <h2 className="h5 text-center mb-3">Test Data</h2>
          <div className="row g-2 mb-3">
            <div className="col">
              <input
                type="number"
                placeholder="Age"
                value={testData.age}
                onChange={(e) =>
                  setTestData({ ...testData, age: e.target.value })
                }
                className="form-control"
              />
            </div>
            <div className="col">
              <input
                type="text"
                placeholder="Department"
                value={testData.department}
                onChange={(e) =>
                  setTestData({ ...testData, department: e.target.value })
                }
                className="form-control"
              />
            </div>
          </div>
          <div className="row g-2 mb-3">
            <div className="col">
              <input
                type="number"
                placeholder="Salary"
                value={testData.salary}
                onChange={(e) =>
                  setTestData({ ...testData, salary: e.target.value })
                }
                className="form-control"
              />
            </div>
            <div className="col">
              <input
                type="number"
                placeholder="Experience"
                value={testData.experience}
                onChange={(e) =>
                  setTestData({ ...testData, experience: e.target.value })
                }
                className="form-control"
              />
            </div>
          </div>
          <button onClick={evaluateRules} className="btn btn-success w-100">
            Evaluate Rules
          </button>
        </div>

        {/* Results Display */}
        <div id="results" className="w-50">
          <h2 className="h5 text-center mb-3">Evaluation Results</h2>
          {evaluationResults.length > 0 ? (
            <div className="list-group">
              {evaluationResults.map((result, index) => (
                <div key={index} className="list-group-item">
                  <p className="mb-1">
                    <strong>Rule ID:</strong> {result.ruleId}
                  </p>
                  <p className="mb-0">
                    <strong>Result:</strong> {result.result ? "Pass" : "Fail"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted text-center">No evaluation results yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RuleManager;
