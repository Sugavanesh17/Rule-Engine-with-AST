import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import TreeVisualizer from "./TreeVisualizer";
import { API_URL } from "../config/api";

const RuleModifier = () => {
  const [rules, setRules] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [modifications, setModifications] = useState({
    path: [],
    operation: "update",
    nodeType: "operator",
    operator: "",
    operandValue: "",
    attribute: "",
  });

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    const response = await axios.get(`${API_URL}/api/rules`);
    setRules(response.data);
  };

  const handleModify = async () => {
    try {
      let modValue;
      if (modifications.nodeType === "operator") {
        modValue = {
          type: "operator",
          value: modifications.operator,
          left: selectedRule.ast.left,
          right: selectedRule.ast.right,
        };
      } else {
        modValue = {
          type: "operand",
          value: modifications.operandValue || modifications.attribute,
        };
      }

      const response = await axios.put(
        `${API_URL}/api/rules/${selectedRule._id}/modify`,
        {
          modifications: [
            {
              path: modifications.path,
              operation: modifications.operation,
              value: modValue,
            },
          ],
        }
      );

      setSelectedRule(response.data);
      toast.success("Rule modified successfully");
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
                <label className="form-label">Modification Type</label>
                <select
                  className="form-select"
                  value={modifications.nodeType}
                  onChange={(e) =>
                    setModifications({
                      ...modifications,
                      nodeType: e.target.value,
                    })
                  }
                >
                  <option value="operator">Operator</option>
                  <option value="operand">Operand</option>
                </select>
              </div>

              {modifications.nodeType === "operator" ? (
                <div className="mb-3">
                  <label className="form-label">New Operator</label>
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
                    <option value=">=">{">="}</option>
                    <option value="<=">{"<="}</option>
                  </select>
                </div>
              ) : (
                <>
                  <div className="mb-3">
                    <label className="form-label">Attribute</label>
                    <select
                      className="form-select"
                      value={modifications.attribute}
                      onChange={(e) =>
                        setModifications({
                          ...modifications,
                          attribute: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Attribute</option>
                      <option value="age">Age</option>
                      <option value="department">Department</option>
                      <option value="salary">Salary</option>
                      <option value="experience">Experience</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Value</label>
                    <input
                      type="text"
                      className="form-control"
                      value={modifications.operandValue}
                      onChange={(e) =>
                        setModifications({
                          ...modifications,
                          operandValue: e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              )}

              <div className="mb-3">
                <label className="form-label">Operation</label>
                <select
                  className="form-select"
                  value={modifications.operation}
                  onChange={(e) =>
                    setModifications({
                      ...modifications,
                      operation: e.target.value,
                    })
                  }
                >
                  <option value="update">Update</option>
                  <option value="delete">Delete</option>
                  <option value="add">Add</option>
                </select>
              </div>

              <button
                className="btn btn-primary w-100 mb-3"
                onClick={handleModify}
              >
                Modify Rule
              </button>

              <div className="mt-4">
                <h4>Current Rule Structure:</h4>
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
