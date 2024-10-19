// components/RuleCombiner.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import TreeVisualizer from "./TreeVisualizer";

const RuleCombiner = () => {
  const [rules, setRules] = useState([]);
  const [selectedRules, setSelectedRules] = useState([]);
  const [combinedAST, setCombinedAST] = useState(null);

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

  const handleCombine = async () => {
    try {
      if (selectedRules.length < 2) {
        toast.error("Select at least 2 rules to combine");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/rules/combine",
        {
          ruleIds: selectedRules,
        }
      );

      setCombinedAST(response.data.combinedAST);
      toast.success("Rules combined successfully");
    } catch (error) {
      toast.error(error.response?.data?.error || "Error combining rules");
    }
  };

  return (
    <div className="container">
      <div className="card shadow">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Combine Rules</h2>
          <div className="mb-3">
            <label className="form-label">Select Rules to Combine</label>
            <select
              multiple
              className="form-select"
              value={selectedRules}
              onChange={(e) =>
                setSelectedRules(
                  Array.from(e.target.selectedOptions, (option) => option.value)
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

          <button
            onClick={handleCombine}
            disabled={selectedRules.length < 2}
            className="btn btn-success w-100"
          >
            Combine Rules
          </button>

          {combinedAST && (
            <div className="mt-4">
              <h4>Combined AST:</h4>
              <pre className="bg-light p-3 rounded">
                {JSON.stringify(combinedAST, null, 2)}
              </pre>
            </div>
          )}

          {combinedAST && (
            <div className="mt-4">
              <h4>Combined Rules Tree:</h4>
              <TreeVisualizer ast={combinedAST} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RuleCombiner;
