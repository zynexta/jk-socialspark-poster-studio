import jwt from 'jsonwebtoken';

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('🚨 CRITICAL SECURITY ALERT: JWT_SECRET environment variable is missing!');
  }

  const effectiveSecret = secret || 'jk_socialspark_super_secret_key_2026';

  jwt.verify(token, effectiveSecret, (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired authentication token' });
    }
    req.user = user;
    next();
  });
};

export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
    next();
  };
};
