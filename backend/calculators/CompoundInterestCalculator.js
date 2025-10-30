const Calculator = require('./Calculator');

/**
 * Compound Interest Calculator Class
 * Inheritance: Extends Calculator base class
 * Encapsulation: Encapsulates compound interest calculation logic
 */
class CompoundInterestCalculator extends Calculator {
  constructor(principal, annualReturn, years) {
    super();
    
    this._principal = this.validatePositiveNumber(principal, 'Principal amount');
    this._annualReturn = parseFloat(annualReturn);
    this._years = this.validatePositiveNumber(years, 'Years');
    
    this.validate();
  }

  // Getters
  get principal() {
    return this._principal;
  }

  get annualReturn() {
    return this._annualReturn;
  }

  get years() {
    return this._years;
  }

  /**
   * Validation - Encapsulation
   */
  validate() {
    if (this._years > 50) {
      throw new Error('Investment period cannot exceed 50 years');
    }
    if (this._annualReturn < 0 || this._annualReturn > 50) {
      throw new Error('Annual return must be between 0% and 50%');
    }
  }

  /**
   * Calculate Compound Interest - Polymorphism
   * Formula: A = P(1 + r)^t
   */
  calculate() {
    const rate = this._annualReturn / 100;
    const finalValue = this._principal * Math.pow(1 + rate, this._years);
    const totalReturn = finalValue - this._principal;
    const returnPercentage = (totalReturn / this._principal) * 100;

    return {
      finalValue: this.round(finalValue),
      principal: this._principal,
      totalReturn: this.round(totalReturn),
      returnPercentage: this.round(returnPercentage)
    };
  }

  /**
   * Generate Chart Data - Polymorphism
   */
  generateChartData() {
    const chartData = [];
    const rate = this._annualReturn / 100;

    for (let year = 0; year <= this._years; year++) {
      const value = this._principal * Math.pow(1 + rate, year);
      chartData.push({
        year,
        principal: this._principal,
        value: Math.round(value)
      });
    }

    return chartData;
  }

  /**
   * Calculate doubling time - Additional feature
   * Rule of 72: Years to double ≈ 72 / rate
   */
  getDoublingTime() {
    if (this._annualReturn === 0) return Infinity;
    return this.round(72 / this._annualReturn, 1);
  }

  getSummary() {
    const results = this.calculate();
    return {
      type: 'Compound Interest',
      principal: this._principal,
      years: this._years,
      annualReturn: this._annualReturn,
      doublingTime: this.getDoublingTime(),
      ...results
    };
  }
}

module.exports = CompoundInterestCalculator;