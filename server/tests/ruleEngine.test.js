// tests/ruleEngine.test.js
const RuleEngine = require("../services/ruleEngine");

describe("Rule Engine Tests", () => {
  // Test rule creation and AST structure
  test("creates valid AST for simple rule", () => {
    const simpleRule = "(age > 30 AND department = 'Sales')";
    const ast = RuleEngine.createRule(simpleRule);
    expect(ast).toBeDefined();
    expect(ast.type).toBe("operator");
    expect(ast.value).toBe("AND");
  });

  // Test rule evaluation
  test("evaluates rules correctly", () => {
    const rule = "(age > 30 AND department = 'Sales') OR experience > 5";
    const ast = RuleEngine.createRule(rule);

    const data1 = { age: 35, department: "Sales", experience: 3 };
    expect(RuleEngine.evaluateRule(ast, data1)).toBeTruthy();

    const data2 = { age: 25, department: "Marketing", experience: 6 };
    expect(RuleEngine.evaluateRule(ast, data2)).toBeTruthy();

    const data3 = { age: 25, department: "Marketing", experience: 2 };
    expect(RuleEngine.evaluateRule(ast, data3)).toBeFalsy();
  });

  // Test error handling
  test("handles invalid rule strings", () => {
    expect(() => {
      RuleEngine.createRule("");
    }).toThrow("Empty rule");

    expect(() => {
      RuleEngine.createRule("((age > 30)))");
    }).toThrow("Unmatched parentheses");
  });

  // Test complex nested rules
  test("handles complex nested expressions", () => {
    const complexRule =
      "((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)";
    const ast = RuleEngine.createRule(complexRule);

    const validData = {
      age: 35,
      department: "Sales",
      salary: 60000,
      experience: 3,
    };

    expect(RuleEngine.evaluateRule(ast, validData)).toBeTruthy();
  });
});
