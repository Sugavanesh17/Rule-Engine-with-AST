const RuleEngine = require("../services/ruleEngine");

describe("Rule Engine Tests", () => {
  test("creates valid AST for simple rule", () => {
    const simpleRule = "(age > 30 AND department = 'Sales')";
    const ast = RuleEngine.createRule(simpleRule);
    expect(ast).toBeDefined();
    expect(ast.type).toBe("operator");
    expect(ast.value).toBe("AND");
  });

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

  test("handles invalid rule strings", () => {
    expect(() => {
      RuleEngine.createRule("");
    }).toThrow("Empty rule");

    expect(() => {
      RuleEngine.createRule("((age > 30)))");
    }).toThrow("Unmatched parentheses");
  });

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

  test("combines rules correctly", () => {
    const rules = [
      "(age > 30 AND department = 'Sales')",
      "(salary > 50000 OR experience > 5)",
    ];

    const combinedAst = RuleEngine.combineRules(rules);
    expect(combinedAst.type).toBe("operator");
    expect(combinedAst.value).toBe("OR");

    const testData = {
      age: 35,
      department: "Sales",
      salary: 45000,
      experience: 3,
    };
    expect(RuleEngine.evaluateRule(combinedAst, testData)).toBeTruthy();
  });

  test("evaluates combined rules with multiple scenarios", () => {
    const rules = [
      "((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing'))",
      "(salary > 50000 OR experience > 5)",
    ];

    const combinedAst = RuleEngine.combineRules(rules);

    const testCases = [
      {
        data: { age: 35, department: "Sales", salary: 45000, experience: 6 },
        expected: true,
      },
      {
        data: {
          age: 23,
          department: "Marketing",
          salary: 55000,
          experience: 2,
        },
        expected: true,
      },
      {
        data: {
          age: 28,
          department: "Engineering",
          salary: 45000,
          experience: 3,
        },
        expected: false,
      },
    ];

    testCases.forEach(({ data, expected }) => {
      expect(RuleEngine.evaluateRule(combinedAst, data)).toBe(expected);
    });
  });
});
