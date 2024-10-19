// services/ruleEngine.js
class RuleEngine {
  static createRule(ruleString) {
    try {
      return this.buildAST(this.tokenize(ruleString));
    } catch (error) {
      throw new Error(`Invalid rule string: ${error.message}`);
    }
  }

  static tokenize(ruleString) {
    return ruleString
      .replace(/[()]/g, " $& ")
      .trim()
      .split(/\s+/)
      .filter((token) => token.length > 0);
  }

  static buildAST(tokens) {
    if (!tokens.length) throw new Error("Empty rule");

    const token = tokens.shift();

    if (token === "(") {
      const left = this.buildAST(tokens);
      const operator = tokens.shift();
      const right = this.buildAST(tokens);
      if (tokens[0] === ")") tokens.shift();
      return {
        type: "operator",
        value: operator,
        left,
        right,
      };
    }

    if (token === ")") return null;

    for (const op of [">=", "<=", ">", "<", "="]) {
      if (token.includes(op)) {
        const [left, right] = token.split(op);
        return {
          type: "operator",
          value: op,
          left: { type: "operand", value: left.trim() },
          right: { type: "operand", value: right.trim().replace(/'/g, "") },
        };
      }
    }

    return { type: "operand", value: token };
  }

  static evaluateRule(node, data) {
    if (!node) return true;

    if (node.type === "operator") {
      switch (node.value) {
        case "AND":
          return (
            this.evaluateRule(node.left, data) &&
            this.evaluateRule(node.right, data)
          );
        case "OR":
          return (
            this.evaluateRule(node.left, data) ||
            this.evaluateRule(node.right, data)
          );
        case ">":
          return (
            Number(this.getNodeValue(node.left, data)) >
            Number(this.getNodeValue(node.right, data))
          );
        case "<":
          return (
            Number(this.getNodeValue(node.left, data)) <
            Number(this.getNodeValue(node.right, data))
          );
        case "=":
          return (
            String(this.getNodeValue(node.left, data)) ===
            String(this.getNodeValue(node.right, data))
          );
        case ">=":
          return (
            Number(this.getNodeValue(node.left, data)) >=
            Number(this.getNodeValue(node.right, data))
          );
        case "<=":
          return (
            Number(this.getNodeValue(node.left, data)) <=
            Number(this.getNodeValue(node.right, data))
          );
      }
    }

    return Boolean(node.value);
  }

  static getNodeValue(node, data) {
    if (node.type === "operand") {
      return data[node.value] !== undefined ? data[node.value] : node.value;
    }
    return node.value;
  }
}

module.exports = RuleEngine;
