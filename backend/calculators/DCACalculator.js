const Calculator = require('./Calculator');

/**
 * DCA Calculator Class
 * Inheritance: Extends Calculator base class
 * Encapsulation: Encapsulates DCA calculation logic
 */
class DCACalculator extends Calculator {
  constructor(monthlyInvestment, years, annualReturn) {
    super(); // Call parent constructor
    
    // Encapsulation: Private-like properties (using convention)
    this._monthlyInvestment = this.validatePositiveNumber(monthlyInvestment, 'Monthly investment');
    this._years = this.validatePositiveNumber(years, 'Years');
    this._annualReturn = parseFloat(annualReturn);
    
    this.validate();
  }

  // Getters (Encapsulation - controlled access)
  get monthlyInvestment() {
    return this._monthlyInvestment;
  }

  get years() {
    return this._years;
  }

  get annualReturn() {
    return this._annualReturn;
  }

  /**
   * Validation method - Encapsulation
   * Validates all inputs before calculation
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
   * Calculate DCA - Polymorphism
   * Implements abstract method from Calculator
   */
  calculate() {
    const months = this._years * 12;
    const monthlyRate = this._annualReturn / 100 / 12;
    let totalValue = 0;

    // DCA formula: Calculate compound growth with monthly contributions
    for (let month = 0; month < months; month++) {
      totalValue = (totalValue + this._monthlyInvestment) * (1 + monthlyRate);
    }

    const totalInvested = this._monthlyInvestment * months;
    const totalReturn = totalValue - totalInvested;
    const returnPercentage = (totalReturn / totalInvested) * 100;

    return {
      finalValue: this.round(totalValue),
      totalInvested: this.round(totalInvested),
      totalReturn: this.round(totalReturn),
      returnPercentage: this.round(returnPercentage)
    };
  }

  /**
   * Generate Chart Data - Polymorphism
   * Implements abstract method from Calculator
   */
  generateChartData() {
    const months = this._years * 12;
    const monthlyRate = this._annualReturn / 100 / 12;
    const chartData = [];

    let invested = 0;
    let value = 0;

    // Generate data points for each year
    for (let month = 0; month <= months; month++) {
      if (month > 0) {
        value = (value + this._monthlyInvestment) * (1 + monthlyRate);
        invested += this._monthlyInvestment;
      }

      // Add data point at year intervals
      if (month % 12 === 0 || month === months) {
        chartData.push({
          year: (month / 12).toFixed(1),
          invested: Math.round(invested),
          value: Math.round(value)
        });
      }
    }

    return chartData;
  }

  /**
   * Get calculation summary - Additional method
   */
  getSummary() {
    const results = this.calculate();
    return {
      type: 'DCA',
      monthlyInvestment: this._monthlyInvestment,
      years: this._years,
      annualReturn: this._annualReturn,
      ...results
    };
  }
}

module.exports = DCACalculator;