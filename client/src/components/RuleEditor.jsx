import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import TreeVisualizer from "./TreeVisualizer";
import { API_URL } from "../config/api";

const RuleEditor = () => {
  const [rule, setRule] = useState({
    name: "",
    ruleString: "",
  });
  const [astRepresentation, setAstRepresentation] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("${API_URL}/api/rules", rule);
      console.log("AST Representation:", response.data.ast);
      setAstRepresentation(response.data.ast);
      toast.success("Rule created successfully!");
      setRule({ name: "", ruleString: "" });
    } catch (error) {
      toast.error(error.response?.data?.error || "Error creating rule");
    }
  };

  return (
    <div className="container">
      <div className="card shadow">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Create New Rule</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Rule Name</label>
              <input
                type="text"
                className="form-control"
                value={rule.name}
                onChange={(e) => setRule({ ...rule, name: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Rule String</label>
              <textarea
                className="form-control"
                rows="4"
                value={rule.ruleString}
                onChange={(e) =>
                  setRule({ ...rule, ruleString: e.target.value })
                }
                placeholder="e.g., (age > 30 AND department = 'Sales') OR (experience > 5)"
                required
              />
            </div>
            <div className="mb-3">
              <h5>Sample Rules:</h5>
              <pre className="bg-light p-2 rounded">
                {`1. ((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)
2. ((age > 30 AND department = 'Marketing')) AND (salary > 20000 OR experience > 5)`}
              </pre>
            </div>
            <button type="submit" className="btn btn-success w-100">
              Create Rule
            </button>
          </form>

          {astRepresentation && (
            <div className="mt-4">
              <h4>Rule Structure:</h4>
              <TreeVisualizer ast={astRepresentation} />
              <hr />
              <h4>AST JSON:</h4>
              <pre className="bg-light p-3 rounded">
                {JSON.stringify(astRepresentation, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RuleEditor;
