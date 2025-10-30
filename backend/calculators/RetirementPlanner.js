const Calculator = require('./Calculator');

/**
 * Retirement Planner Calculator Class
 * Inheritance: Extends Calculator base class
 * Encapsulation: Encapsulates retirement planning logic
 */
class RetirementPlanner extends Calculator {
  constructor(currentAge, retirementAge, currentSavings, targetAmount, annualReturn) {
    super();
    
    this._currentAge = this.validatePositiveNumber(currentAge, 'Current age');
    this._retirementAge = this.validatePositiveNumber(retirementAge, 'Retirement age');
    this._currentSavings = parseFloat(currentSavings);
    this._targetAmount = this.validatePositiveNumber(targetAmount, 'Target amount');
    this._annualReturn = parseFloat(annualReturn);
    
    this.validate();
  }

  // Getters
  get currentAge() {
    return this._currentAge;
  }

  get retirementAge() {
    return this._retirementAge;
  }

  get currentSavings() {
    return this._currentSavings;
  }

  get targetAmount() {
    return this._targetAmount;
  }

  get annualReturn() {
    return this._annualReturn;
  }

  /**
   * Validation - Encapsulation
   */
  validate() {
    if (this._currentAge < 18) {
      throw new Error('Current age must be at least 18');
    }
    if (this._currentAge > 80) {
      throw new Error('Current age cannot exceed 80');
    }
    if (this._retirementAge < 50) {
      throw new Error('Retirement age must be at least 50');
    }
    if (this._retirementAge > 100) {
      throw new Error('Retirement age cannot exceed 100');
    }
    if (this._retirementAge <= this._currentAge) {
      throw new Error('Retirement age must be greater than current age');
    }
    if (this._currentSavings < 0) {
      throw new Error('Current savings cannot be negative');
    }
    if (this._annualReturn < 0 || this._annualReturn > 50) {
      throw new Error('Annual return must be between 0% and 50%');
    }
  }

  /**
   * Calculate Retirement Plan - Polymorphism
   */
  calculate() {
    const yearsToRetirement = this._retirementAge - this._currentAge;
    const months = yearsToRetirement * 12;
    const monthlyRate = this._annualReturn / 100 / 12;

    // Future value of current savings
    const futureValueOfSavings = this._currentSavings * Math.pow(
      1 + monthlyRate,
      months
    );

    // Remaining amount needed
    const remainingAmount = this._targetAmount - futureValueOfSavings;

    // Calculate monthly contribution needed
    let monthlyRequired = 0;
    if (remainingAmount > 0 && monthlyRate > 0) {
      // PMT formula: Payment = PV * r / (1 - (1 + r)^-n)
      // Rearranged for FV: Payment = FV * r / ((1 + r)^n - 1)
      monthlyRequired = (remainingAmount * monthlyRate) / 
        (Math.pow(1 + monthlyRate, months) - 1);
    }

    const totalToInvest = monthlyRequired * months;
    const projectedValue = this._targetAmount;

    return {
      yearsToRetirement,
      monthlyRequired: this.round(Math.max(0, monthlyRequired)),
      totalToInvest: this.round(totalToInvest),
      projectedValue: this.round(projectedValue),
      shortfall: remainingAmount > 0 ? 0 : this.round(Math.abs(remainingAmount)),
      surplus: remainingAmount < 0 ? this.round(Math.abs(remainingAmount)) : 0
    };
  }

  /**
   * Generate Chart Data - Polymorphism
   */
  generateChartData() {
    const yearsToRetirement = this._retirementAge - this._currentAge;
    const monthlyRate = this._annualReturn / 100 / 12;
    const chartData = [];
    
    const results = this.calculate();
    let currentValue = this._currentSavings;

    for (let year = 0; year <= yearsToRetirement; year++) {
      const age = this._currentAge + year;
      
      if (year > 0) {
        // Grow existing savings and add monthly contributions
        for (let month = 0; month < 12; month++) {
          currentValue = (currentValue + results.monthlyRequired) * (1 + monthlyRate);
        }
      }

      chartData.push({
        age: Math.round(age),
        value: Math.round(currentValue),
        target: this._targetAmount
      });
    }

    return chartData;
  }

  /**
   * Calculate if on track - Additional feature
   */
  isOnTrack() {
    const results = this.calculate();
    return results.monthlyRequired <= (this._targetAmount * 0.05 / 12); // 5% rule
  }

  getSummary() {
    const results = this.calculate();
    return {
      type: 'Retirement Planning',
      currentAge: this._currentAge,
      retirementAge: this._retirementAge,
      currentSavings: this._currentSavings,
      targetAmount: this._targetAmount,
      annualReturn: this._annualReturn,
      onTrack: this.isOnTrack(),
      ...results
    };
  }
}

module.exports = RetirementPlanner;