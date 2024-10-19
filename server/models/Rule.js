const mongoose = require("mongoose");

const nodeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["operator", "operand"],
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    left: {
      type: mongoose.Schema.Types.Mixed,
    },
    right: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { _id: false }
);

const attributeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    dataType: {
      type: String,
      enum: ["numeric", "string", "boolean"],
      required: true,
    },
    minValue: Number,
    maxValue: Number,
    allowedValues: [String],
  },
  { _id: false }
);

const ruleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ruleString: {
    type: String,
    required: true,
  },
  ast: nodeSchema,
  version: {
    type: Number,
    default: 1,
  },
  previousVersions: [
    {
      ruleString: String,
      ast: mongoose.Schema.Types.Mixed,
      version: Number,
      timestamp: Date,
    },
  ],
  attributes: [attributeSchema],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save middleware for version control
ruleSchema.pre("save", function (next) {
  if (this.isModified("ruleString")) {
    const previousVersion = {
      ruleString: this.ruleString,
      ast: this.ast,
      version: this.version,
      timestamp: new Date(),
    };
    this.previousVersions.push(previousVersion);
    this.version += 1;
  }
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Rule", ruleSchema);
