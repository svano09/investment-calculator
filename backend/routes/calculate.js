const express = require('express');
const router = express.Router();
const AuthMiddleware = require('../middleware/auth');
const ValidationMiddleware = require('../middleware/validation');
const Calculation = require('../models/Calculation');
const DCACalculator = require('../calculators/DCACalculator');
const CompoundInterestCalculator = require('../calculators/CompoundInterestCalculator');
const RetirementPlanner = require('../calculators/RetirementPlanner');

/**
 * Calculate Routes - Fixed
 */

// POST /api/calculate/dca
router.post('/dca', async (req, res) => {
  try {
    console.log('🔵 DCA Calculation Request');
    console.log('📥 Body:', req.body);
    console.log('👤 Session:', req.session);
    console.log('👤 User ID:', req.session?.userId);

    const { monthly, years, returnRate } = req.body;

    // Validate inputs manually
    if (!monthly || !years || !returnRate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: monthly, years, returnRate'
      });
    }

    // Create calculator instance
    const calculator = new DCACalculator(
      parseFloat(monthly),
      parseFloat(years),
      parseFloat(returnRate)
    );

    // Calculate results
    const results = calculator.calculate();
    const chartData = calculator.generateChartData();

    console.log('✅ Calculation successful:', results);

    // Save to database if authenticated
    if (req.session && req.session.userId) {
      try {
        console.log('💾 User is logged in, saving calculation...');

        const calculation = new Calculation({
          userId: req.session.userId,
          type: 'dca',
          inputs: {
            monthly: parseFloat(monthly),
            years: parseFloat(years),
            returnRate: parseFloat(returnRate)
          },
          results,
          chartData
        });

        const saved = await calculation.save();
        console.log('✅ Calculation saved with ID:', saved._id);

        // Save session
        req.session.save((err) => {
          if (err) {
            console.error('❌ Session save error:', err);
          } else {
            console.log('✅ Session saved');
          }
        });

        return res.json({
          success: true,
          results,
          chartData,
          calculationId: saved._id,
          saved: true,
          message: 'Calculation completed and saved'
        });
      } catch (saveError) {
        console.error('❌ Save error:', saveError);
        // Still return results even if save fails
        return res.json({
          success: true,
          results,
          chartData,
          saved: false,
          saveError: saveError.message,
          message: 'Calculation completed but not saved'
        });
      }
    }

    // Guest user - no save
    console.log('👤 Guest user - calculation only');
    return res.json({
      success: true,
      results,
      chartData,
      saved: false,
      message: 'Calculation completed (login to save)'
    });

  } catch (error) {
    console.error('❌ DCA Calculation Error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Calculation failed'
    });
  }
});

// POST /api/calculate/compound
router.post('/compound', async (req, res) => {
  try {
    console.log('🔵 Compound Calculation Request');
    console.log('📥 Body:', req.body);
    console.log('👤 User ID:', req.session?.userId);

    const { principal, years, returnRate } = req.body;

    // Validate inputs
    if (!principal || !years || !returnRate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: principal, years, returnRate'
      });
    }

    // Create calculator
    const calculator = new CompoundInterestCalculator(
      parseFloat(principal),
      parseFloat(returnRate),
      parseFloat(years)
    );

    // Calculate
    const results = calculator.calculate();
    const chartData = calculator.generateChartData();

    console.log('✅ Calculation successful:', results);

    // Save if authenticated
    if (req.session && req.session.userId) {
      try {
        console.log('💾 Saving calculation...');

        const calculation = new Calculation({
          userId: req.session.userId,
          type: 'compound',
          inputs: {
            principal: parseFloat(principal),
            years: parseFloat(years),
            returnRate: parseFloat(returnRate)
          },
          results,
          chartData
        });

        const saved = await calculation.save();
        console.log('✅ Calculation saved:', saved._id);

        req.session.save((err) => {
          if (err) console.error('❌ Session save error:', err);
        });

        return res.json({
          success: true,
          results,
          chartData,
          calculationId: saved._id,
          saved: true,
          message: 'Calculation completed and saved'
        });
      } catch (saveError) {
        console.error('❌ Save error:', saveError);
        return res.json({
          success: true,
          results,
          chartData,
          saved: false,
          saveError: saveError.message,
          message: 'Calculation completed but not saved'
        });
      }
    }

    // Guest user
    console.log('👤 Guest user');
    return res.json({
      success: true,
      results,
      chartData,
      saved: false,
      message: 'Calculation completed (login to save)'
    });

  } catch (error) {
    console.error('❌ Compound Calculation Error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Calculation failed'
    });
  }
});

// POST /api/calculate/retirement
router.post('/retirement', async (req, res) => {
  try {
    console.log('🔵 Retirement Calculation Request');
    console.log('📥 Body:', req.body);
    console.log('👤 User ID:', req.session?.userId);

    const { currentAge, retirementAge, currentSavings, targetAmount, returnRate } = req.body;

    // Validate inputs
    if (!currentAge || !retirementAge || currentSavings === undefined || !targetAmount || !returnRate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Create calculator
    const calculator = new RetirementPlanner(
      parseFloat(currentAge),
      parseFloat(retirementAge),
      parseFloat(currentSavings),
      parseFloat(targetAmount),
      parseFloat(returnRate)
    );

    // Calculate
    const results = calculator.calculate();
    const chartData = calculator.generateChartData();

    console.log('✅ Calculation successful:', results);

    // Save if authenticated
    if (req.session && req.session.userId) {
      try {
        console.log('💾 Saving calculation...');

        const calculation = new Calculation({
          userId: req.session.userId,
          type: 'retirement',
          inputs: {
            currentAge: parseFloat(currentAge),
            retirementAge: parseFloat(retirementAge),
            currentSavings: parseFloat(currentSavings),
            targetAmount: parseFloat(targetAmount),
            returnRate: parseFloat(returnRate)
          },
          results,
          chartData
        });

        const saved = await calculation.save();
        console.log('✅ Calculation saved:', saved._id);

        req.session.save((err) => {
          if (err) console.error('❌ Session save error:', err);
        });

        return res.json({
          success: true,
          results,
          chartData,
          calculationId: saved._id,
          saved: true,
          message: 'Calculation completed and saved'
        });
      } catch (saveError) {
        console.error('❌ Save error:', saveError);
        return res.json({
          success: true,
          results,
          chartData,
          saved: false,
          saveError: saveError.message,
          message: 'Calculation completed but not saved'
        });
      }
    }

    // Guest user
    console.log('👤 Guest user');
    return res.json({
      success: true,
      results,
      chartData,
      saved: false,
      message: 'Calculation completed (login to save)'
    });

  } catch (error) {
    console.error('❌ Retirement Calculation Error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Calculation failed'
    });
  }
});

module.exports = router;