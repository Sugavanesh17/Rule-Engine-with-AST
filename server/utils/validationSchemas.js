const Joi = require("joi");

const ruleSchema = Joi.object({
  name: Joi.string().required(),
  ruleString: Joi.string().required(),
});

const evaluationSchema = Joi.object({
  data: Joi.object().required(),
  ruleIds: Joi.array().items(Joi.string()).required(),
});

module.exports = { ruleSchema, evaluationSchema };
