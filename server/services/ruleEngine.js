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

  static combineRules(rules) {
    if (!rules?.length) throw new Error("No rules provided");

    const asts = rules.map((rule) => this.createRule(rule));
    return asts.reduce((combined, current) => ({
      type: "operator",
      value: "OR",
      left: combined,
      right: current,
    }));
  }

  static astToString(ast) {
    if (!ast) return "";

    if (ast.type === "operand") {
      return ast.value;
    }

    if (ast.type === "operator") {
      const left = this.astToString(ast.left);
      const right = this.astToString(ast.right);

      if (["AND", "OR"].includes(ast.value)) {
        return `(${left} ${ast.value} ${right})`;
      }

      return `${left}${ast.value}${right}`;
    }

    return "";
  }

  static modifyRule(ast, modifications) {
    const modified = JSON.parse(JSON.stringify(ast));

    modifications.forEach((mod) => {
      let current = modified;
      const lastIndex = mod.path.length - 1;

      for (let i = 0; i < lastIndex; i++) {
        current = current[mod.path[i]];
      }

      switch (mod.operation) {
        case "update":
          current[mod.path[lastIndex]] = mod.value;
          break;
        case "delete":
          delete current[mod.path[lastIndex]];
          break;
        case "add":
          current[mod.path[lastIndex]] = mod.value;
          break;
      }
    });

    return modified;
  }
}

module.exports = RuleEngine;
