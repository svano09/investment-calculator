const DCACalculator = require('../calculators/DCACalculator');
const CompoundInterestCalculator = require('../calculators/CompoundInterestCalculator');
const RetirementPlanner = require('../calculators/RetirementPlanner');

/**
 * Calculator Factory Class
 * Design Pattern: Factory Pattern
 * OOP Principle: Abstraction & Encapsulation
 */
class CalculatorFactory {
  /**
   * Create calculator instance based on type
   * @param {string} type - Calculator type
   * @param {object} inputs - Input parameters
   * @returns {Calculator} - Calculator instance
   */
  static createCalculator(type, inputs) {
    switch (type) {
      case 'dca':
        return new DCACalculator(
          inputs.monthly,
          inputs.years,
          inputs.returnRate
        );

      case 'compound':
        return new CompoundInterestCalculator(
          inputs.principal,
          inputs.returnRate,
          inputs.years
        );

      case 'retirement':
        return new RetirementPlanner(
          inputs.currentAge,
          inputs.retirementAge,
          inputs.currentSavings,
          inputs.targetAmount,
          inputs.returnRate
        );

      default:
        throw new Error(`Unknown calculator type: ${type}`);
    }
  }

  /**
   * Get available calculator types
   */
  static getAvailableTypes() {
    return ['dca', 'compound', 'retirement'];
  }

  /**
   * Validate calculator type
   */
  static isValidType(type) {
    return this.getAvailableTypes().includes(type);
  }
}

module.exports = CalculatorFactory;