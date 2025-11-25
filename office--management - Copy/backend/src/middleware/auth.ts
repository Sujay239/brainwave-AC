import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret', (err: any, user: any) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    (req as any).user = user;
    next();
  });
}
