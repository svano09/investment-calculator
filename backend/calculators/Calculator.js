class Calculator {
  constructor() {
    if (new.target === Calculator) {
      throw new Error('Cannot instantiate abstract class Calculator directly');
    }
  }

  /**
   * Abstract method - Must be implemented by subclasses
   * Polymorphism: Each calculator implements this differently
   */
  calculate() {
    throw new Error('Method calculate() must be implemented by subclass');
  }

  /**
   * Abstract method - Must be implemented by subclasses
   * Polymorphism: Each calculator generates different chart data
   */
  generateChartData() {
    throw new Error('Method generateChartData() must be implemented by subclass');
  }

  /**
   * Shared validation method
   * Inheritance: All subclasses can use this
   */
  validatePositiveNumber(value, fieldName) {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
      throw new Error(`${fieldName} must be a positive number`);
    }
    return num;
  }

  /**
   * Shared rounding method
   * Encapsulation: Internal helper method
   */
  round(value, decimals = 2) {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }
}

module.exports = Calculator;