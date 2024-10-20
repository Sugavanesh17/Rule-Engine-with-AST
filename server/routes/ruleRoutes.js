const express = require("express");
const router = express.Router();
const Rule = require("../models/Rule");
const {
  createRule,
  evaluateRule,
  updateRule,
  combineRules,
  modifyRule,
} = require("../controllers/ruleController");
const validateRule = require("../middleware/validateRule");

router.post("/", validateRule, createRule);

router.get("/", async (req, res) => {
  try {
    const rules = await Rule.find({ isActive: true });
    res.json(rules);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/evaluate", evaluateRule);

router.post("/combine", combineRules);

router.put("/:id", validateRule, updateRule);

router.delete("/:id", async (req, res) => {
  try {
    await Rule.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: "Rule deactivated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:ruleId/modify", modifyRule);

module.exports = router;
