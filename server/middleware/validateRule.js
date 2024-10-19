const validateRule = async (req, res, next) => {
  try {
    const { ruleString, name } = req.body;

    // Basic validations
    if (!ruleString || !name) {
      return res.status(400).json({
        error: !ruleString
          ? "Rule string is required"
          : "Rule name is required",
      });
    }

    // Check for invalid characters
    if (ruleString.match(/[^a-zA-Z0-9\s()><='"+\-*/]/)) {
      return res
        .status(400)
        .json({ error: "Invalid characters in rule string" });
    }

    // Validate operators
    const validOperators = ["AND", "OR", ">", "<", "=", ">=", "<="];
    const operatorRegex = /\b(AND|OR)\b|[><]=?|=/g;
    const operators = ruleString.match(operatorRegex) || [];
    const invalidOperators = operators.filter(
      (op) => !validOperators.includes(op)
    );

    if (invalidOperators.length) {
      return res.status(400).json({
        error: `Invalid operators found: ${invalidOperators.join(", ")}`,
      });
    }

    // Check for missing operators
    if (!ruleString.match(/(AND|OR|[<>=])/)) {
      return res.status(400).json({ error: "Missing required operators" });
    }

    // Validate parentheses
    const stack = [];
    for (const char of ruleString) {
      if (char === "(") stack.push(char);
      if (char === ")") {
        if (stack.length === 0) {
          return res.status(400).json({ error: "Unmatched parentheses" });
        }
        stack.pop();
      }
    }
    if (stack.length > 0) {
      return res.status(400).json({ error: "Unmatched parentheses" });
    }

    // Validate attributes and types
    const validAttributes = ["age", "department", "salary", "experience"];
    const attributeRegex =
      /\b(age|department|salary|experience)\b(?=\s*[><=])/g;
    const attributes = ruleString.match(attributeRegex) || [];
    const invalidAttributes = attributes.filter(
      (attr) => !validAttributes.includes(attr)
    );

    if (invalidAttributes.length) {
      return res.status(400).json({
        error: `Invalid attributes found: ${invalidAttributes.join(", ")}`,
      });
    }

    // Validate numeric values
    const numberOperands = ruleString.match(/(?<=[><]=?\s*)\d+/g) || [];
    for (const num of numberOperands) {
      if (isNaN(Number(num))) {
        return res.status(400).json({
          error: `Invalid numeric value: ${num}`,
        });
      }
    }

    // Validate string values
    const stringOperands = ruleString.match(/'[^']*'/g) || [];
    if (!stringOperands.every((str) => str.match(/^'[^']*'$/))) {
      return res.status(400).json({ error: "Invalid string format" });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = validateRule;
