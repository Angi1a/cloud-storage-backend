const adminAuth = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(403).send({ error: 'Access denied. Requires admin privileges.' });
    }
  };
  
  module.exports = adminAuth;
  