class FunctionRegistry {
  constructor() {
    this.functions = new Map();
  }

  register(name, fn, description) {
    this.functions.set(name, { fn, description });
  }

  execute(name, args) {
    const func = this.functions.get(name);
    if (!func) throw new Error(`Function ${name} not found`);
    return func.fn(...args);
  }
}

const registry = new FunctionRegistry();

// Register some default functions
registry.register(
  "daysBetween",
  (date1, date2) =>
    Math.abs((new Date(date1) - new Date(date2)) / (1000 * 60 * 60 * 24)),
  "Calculate days between two dates"
);

registry.register(
  "inRange",
  (value, min, max) => value >= min && value <= max,
  "Check if value is within range"
);

module.exports = registry;
