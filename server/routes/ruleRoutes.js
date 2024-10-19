// routes/ruleRoutes.js
const express = require("express");
const router = express.Router();
const { Rule } = require("../models/Rule");
const RuleEngine = require("../services/ruleEngine");

router.post("/", async (req, res) => {
  try {
    const { name, ruleString } = req.body;
    const ast = RuleEngine.createRule(ruleString);
    const rule = new Rule({ name, ruleString, ast });
    await rule.save();
    res.json(rule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const rules = await Rule.find({ isActive: true });
    res.json(rules);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/evaluate", async (req, res) => {
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
});

router.put("/:id", async (req, res) => {
  try {
    const { name, ruleString } = req.body;
    const ast = RuleEngine.createRule(ruleString);
    const rule = await Rule.findByIdAndUpdate(
      req.params.id,
      { name, ruleString, ast, updatedAt: Date.now() },
      { new: true }
    );
    res.json(rule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Rule.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: "Rule deactivated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
