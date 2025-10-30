class AuthMiddleware {
  /**
   * Check if user is authenticated (required)
   */
  static isAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
      return next();
    }
    return res.status(401).json({ 
      message: 'Authentication required',
      authenticated: false
    });
  }

  /**
   * Optional authentication (guest allowed)
   */
  static optionalAuth(req, res, next) {
    // Pass through regardless of auth status
    next();
  }

  /**
   * Check if user owns the resource
   */
  static isResourceOwner(resourceUserId) {
    return (req, res, next) => {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      if (req.session.userId.toString() !== resourceUserId.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
      next();
    };
  }
}

module.exports = AuthMiddleware;