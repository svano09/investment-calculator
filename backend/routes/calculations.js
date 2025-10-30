const express = require('express');
const router = express.Router();
const AuthMiddleware = require('../middleware/auth');
const Calculation = require('../models/Calculation');

/**
 * Calculation CRUD Routes
 * Handles calculation history management (authenticated users only)
 */

// GET /api/calculations - Get all calculations for current user
router.get('/',
  AuthMiddleware.isAuthenticated,
  async (req, res) => {
    try {
      const calculations = await Calculation.getUserCalculations(
        req.session.userId,
        50 // limit
      );

      res.json({
        success: true,
        count: calculations.length,
        calculations
      });
    } catch (error) {
      console.error('Get calculations error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Failed to fetch calculations' 
      });
    }
});

// GET /api/calculations/type/:type - Get calculations by type
router.get('/type/:type',
  AuthMiddleware.isAuthenticated,
  async (req, res) => {
    try {
      const { type } = req.params;
      
      // Validate type
      if (!['dca', 'compound', 'retirement'].includes(type)) {
        return res.status(400).json({ 
          success: false,
          message: 'Invalid calculation type' 
        });
      }

      const calculations = await Calculation.getByType(
        req.session.userId,
        type
      );

      res.json({
        success: true,
        type,
        count: calculations.length,
        calculations
      });
    } catch (error) {
      console.error('Get calculations by type error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Failed to fetch calculations' 
      });
    }
});

// GET /api/calculations/:id - Get single calculation
router.get('/:id',
  AuthMiddleware.isAuthenticated,
  async (req, res) => {
    try {
      const calculation = await Calculation.findOne({
        _id: req.params.id,
        userId: req.session.userId
      });

      if (!calculation) {
        return res.status(404).json({ 
          success: false,
          message: 'Calculation not found' 
        });
      }

      res.json({
        success: true,
        calculation
      });
    } catch (error) {
      console.error('Get calculation error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Failed to fetch calculation' 
      });
    }
});

// DELETE /api/calculations/:id - Delete calculation
router.delete('/:id',
  AuthMiddleware.isAuthenticated,
  async (req, res) => {
    try {
      const calculation = await Calculation.findOneAndDelete({
        _id: req.params.id,
        userId: req.session.userId
      });

      if (!calculation) {
        return res.status(404).json({ 
          success: false,
          message: 'Calculation not found' 
        });
      }

      res.json({
        success: true,
        message: 'Calculation deleted successfully',
        deletedId: req.params.id
      });
    } catch (error) {
      console.error('Delete calculation error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Failed to delete calculation' 
      });
    }
});

// DELETE /api/calculations - Delete all calculations for user
router.delete('/',
  AuthMiddleware.isAuthenticated,
  async (req, res) => {
    try {
      const result = await Calculation.deleteMany({
        userId: req.session.userId
      });

      res.json({
        success: true,
        message: `Deleted ${result.deletedCount} calculations`,
        deletedCount: result.deletedCount
      });
    } catch (error) {
      console.error('Delete all calculations error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Failed to delete calculations' 
      });
    }
});

// GET /api/calculations/stats/summary - Get calculation statistics
router.get('/stats/summary',
  AuthMiddleware.isAuthenticated,
  async (req, res) => {
    try {
      const calculations = await Calculation.find({
        userId: req.session.userId
      });

      const stats = {
        total: calculations.length,
        byType: {
          dca: calculations.filter(c => c.type === 'dca').length,
          compound: calculations.filter(c => c.type === 'compound').length,
          retirement: calculations.filter(c => c.type === 'retirement').length
        },
        lastCalculation: calculations.length > 0 
          ? calculations[calculations.length - 1].createdAt 
          : null
      };

      res.json({
        success: true,
        stats
      });
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Failed to fetch statistics' 
      });
    }
});

module.exports = router;