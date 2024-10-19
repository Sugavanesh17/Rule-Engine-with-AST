const validateRule = async (req, res, next) => {
  try {
    const { ruleString, name } = req.body;

    // Validate required fields
    if (!ruleString) {
      return res.status(400).json({ error: "Rule string is required" });
    }
    if (!name) {
      return res.status(400).json({ error: "Rule name is required" });
    }

    // Check for valid operators - only match standalone operators and comparisons
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

    // Validate parentheses matching
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

    // Validate attributes using word boundaries to avoid partial matches
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

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = validateRule;
