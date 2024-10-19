// controllers/ruleController.js
const Rule = require("../models/Rule");
const RuleEngine = require("../services/ruleEngine");

const ruleController = {
  createRule: async (req, res) => {
    try {
      const { name, ruleString } = req.body;
      const ast = RuleEngine.createRule(ruleString);
      const rule = new Rule({ name, ruleString, ast });
      await rule.save();
      res.status(201).json(rule);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getAllRules: async (req, res) => {
    try {
      const rules = await Rule.find({ isActive: true });
      res.json(rules);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  evaluateRules: async (req, res) => {
    try {
      const { data, ruleIds } = req.body;
      const rules = await Rule.find({ _id: { $in: ruleIds }, isActive: true });
      const results = rules.map((rule) => ({
        ruleId: rule._id,
        ruleName: rule.name,
        result: RuleEngine.evaluateRule(rule.ast, data),
      }));
      res.json({ results });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateRule: async (req, res) => {
    try {
      const { name, ruleString } = req.body;
      const ast = RuleEngine.createRule(ruleString);
      const rule = await Rule.findByIdAndUpdate(
        req.params.id,
        { name, ruleString, ast, updatedAt: Date.now() },
        { new: true }
      );
      if (!rule) {
        return res.status(404).json({ error: "Rule not found" });
      }
      res.json(rule);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteRule: async (req, res) => {
    try {
      const rule = await Rule.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
      );
      if (!rule) {
        return res.status(404).json({ error: "Rule not found" });
      }
      res.json({ message: "Rule deactivated successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = ruleController;
