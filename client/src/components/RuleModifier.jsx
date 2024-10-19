// components/RuleModifier.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import TreeVisualizer from "./TreeVisualizer";

const RuleModifier = () => {
  const [rules, setRules] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [modifications, setModifications] = useState({
    operator: "",
    value: "",
    path: [],
  });

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    const response = await axios.get("http://localhost:5000/api/rules");
    setRules(response.data);
  };

  const handleModify = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/rules/${selectedRule._id}/modify`,
        {
          modifications: [
            {
              path: modifications.path,
              operation: "update",
              value: {
                type: "operator",
                value: modifications.operator,
                left: selectedRule.ast.left,
                right: selectedRule.ast.right,
              },
            },
          ],
        }
      );
      toast.success("Rule modified successfully");
      setSelectedRule(response.data);
    } catch (error) {
      toast.error(error.response?.data?.error);
    }
  };

  return (
    <div className="container">
      <div className="card shadow">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Modify Rule</h2>

          <select
            className="form-select mb-3"
            onChange={(e) =>
              setSelectedRule(rules.find((r) => r._id === e.target.value))
            }
          >
            <option value="">Select Rule</option>
            {rules.map((rule) => (
              <option key={rule._id} value={rule._id}>
                {rule.name}
              </option>
            ))}
          </select>

          {selectedRule && (
            <>
              <div className="mb-3">
                <label className="form-label">Modify Operator</label>
                <select
                  className="form-select"
                  value={modifications.operator}
                  onChange={(e) =>
                    setModifications({
                      ...modifications,
                      operator: e.target.value,
                    })
                  }
                >
                  <option value="">Select Operator</option>
                  <option value="AND">AND</option>
                  <option value="OR">OR</option>
                  <option value=">">{">"}</option>
                  <option value="<">{"<"}</option>
                  <option value="=">=</option>
                </select>
              </div>

              <button className="btn btn-primary w-100" onClick={handleModify}>
                Modify Rule
              </button>

              <div className="mt-4">
                <h4>Current AST:</h4>
                <TreeVisualizer ast={selectedRule.ast} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RuleModifier;
