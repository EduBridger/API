import jwt from 'jsonwebtoken';

export const isAuthenticate = (req, res, next) => {
  const accessToken = req.header('Authorization')?.replace('Bearer ', '');
  if (!accessToken) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

export const authorize = (role) => (req, res, next) => {
  if (req.user.role !== role) return res.status(403).json({ message: 'Access forbidden' });
  next();
};
