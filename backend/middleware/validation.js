class ValidationMiddleware {
  /**
   * Validate email format
   */
  static validateEmail(req, res, next) {
    const { email } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    next();
  }

  /**
   * Validate password strength
   */
  static validatePassword(req, res, next) {
    const { password } = req.body;
    
    if (!password || password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters' 
      });
    }
    next();
  }

  /**
   * Validate calculation inputs
   */
  static validateCalculationInputs(req, res, next) {
    const inputs = req.body;
    
    // Check if inputs object exists
    if (!inputs || typeof inputs !== 'object') {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    // Validate all numeric fields are present and valid
    for (const [key, value] of Object.entries(inputs)) {
      if (value === undefined || value === null || value === '') {
        return res.status(400).json({ 
          message: `Missing required field: ${key}` 
        });
      }
      
      const num = parseFloat(value);
      if (isNaN(num)) {
        return res.status(400).json({ 
          message: `Invalid number for field: ${key}` 
        });
      }
    }
    
    next();
  }
}

module.exports = ValidationMiddleware;