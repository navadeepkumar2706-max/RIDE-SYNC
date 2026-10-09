import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export async function requireAuth(req, res, next) {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Authentication required. Please log in.' });
    }

    const secret = process.env.JWT_SECRET || 'ridesync_hyderabad_smart_carpooling_jwt_secret_key_2026';
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User session no longer valid.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired authentication token.' });
  }
}

export function optionalAuth(req, res, next) {
  try {
    let token = req.cookies?.token;
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
      const secret = process.env.JWT_SECRET || 'ridesync_hyderabad_smart_carpooling_jwt_secret_key_2026';
      const decoded = jwt.verify(token, secret);
      User.findById(decoded.id).then((user) => {
        if (user) req.user = user;
        next();
      }).catch(() => next());
    } else {
      next();
    }
  } catch {
    next();
  }
}
