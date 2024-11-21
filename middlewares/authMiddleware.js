import jwt from 'jsonwebtoken';
import { permissions } from '../util/rbac.js';

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

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ 
      message: `Access forbidden. Required roles: ${roles.join(', ')}`
    });
  }
  next();
};

export const hasPermission = (requiredAction) => {
  return async (req, res, next) => {
    try {
      const userRole = req.user.role;
      
      // Find permission config for user's role
      const rolePermissions = permissions.find(p => p.role === userRole);
      
      if (!rolePermissions) {
        return res.status(403).json({
          message: `No permissions found for role: ${userRole}`
        });
      }

      // Check if user's role has permission for this action
      if (rolePermissions.actions.includes(requiredAction)) {
        next();
      } else {
        return res.status(403).json({
          message: `Action '${requiredAction}' not allowed for role: ${userRole}`
        });
      }

    } catch (error) {
      next(error);
    }
  }
};

export const checkRole = (role) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (req.user.role !== role) {
            return res.status(403).json({
                success: false,
                message: `Access denied. ${role} role required.`
            });
        }

        next();
    };
};
