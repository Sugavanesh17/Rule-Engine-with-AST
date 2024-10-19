// middleware/validateRequest.js
const Joi = require("joi");
const { ruleSchema } = require("../utils/validationSchemas");

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
};

module.exports = validateRequest;
