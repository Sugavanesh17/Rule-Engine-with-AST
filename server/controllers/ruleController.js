// server/controllers/ruleController.js
const Rule = require("../models/Rule");
const RuleEngine = require("../services/ruleEngine");

const createRule = async (req, res) => {
  try {
    const { name, ruleString } = req.body;
    const ast = RuleEngine.createRule(ruleString);

    const rule = new Rule({
      name,
      ruleString,
      ast,
      version: 1,
    });

    await rule.save();
    res.status(201).json(rule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const evaluateRule = async (req, res) => {
  try {
    const { data, ruleIds } = req.body;
    const rules = await Rule.find({
      _id: { $in: ruleIds },
      isActive: true,
    });

    if (!rules.length) {
      return res.status(404).json({ error: "No active rules found" });
    }

    const results = rules.map((rule) => ({
      ruleId: rule._id,
      name: rule.name,
      result: RuleEngine.evaluateRule(rule.ast, data),
    }));

    res.json({ results });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const combineRules = async (req, res) => {
  try {
    const { ruleIds } = req.body;
    const rules = await Rule.find({ _id: { $in: ruleIds }, isActive: true });

    if (!rules.length) {
      return res.status(404).json({ error: "No active rules found" });
    }

    const ruleStrings = rules.map((r) => r.ruleString);
    const combinedAST = RuleEngine.combineRules(ruleStrings);

    res.json({ combinedAST });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateRule = async (req, res) => {
  try {
    const { ruleString } = req.body;
    const ast = RuleEngine.createRule(ruleString);

    const rule = await Rule.findById(req.params.id);
    if (!rule) {
      return res.status(404).json({ error: "Rule not found" });
    }

    // Store previous version
    rule.previousVersions.push({
      ruleString: rule.ruleString,
      ast: rule.ast,
      version: rule.version,
      timestamp: new Date(),
    });

    rule.ruleString = ruleString;
    rule.ast = ast;
    rule.version += 1;
    rule.updatedAt = new Date();

    await rule.save();
    res.json(rule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const modifyRule = async (req, res) => {
  try {
    const { ruleId } = req.params;
    const { modifications } = req.body;

    const rule = await Rule.findById(ruleId);
    if (!rule) {
      return res.status(404).json({ error: "Rule not found" });
    }

    // Store current version
    rule.previousVersions.push({
      ruleString: rule.ruleString,
      ast: rule.ast,
      version: rule.version,
      timestamp: new Date(),
    });

    // Apply modifications
    rule.ast = RuleEngine.modifyRule(rule.ast, modifications);
    rule.version += 1;
    rule.updatedAt = new Date();

    await rule.save();
    res.json(rule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createRule,
  evaluateRule,
  updateRule,
  combineRules,
  modifyRule,
};
