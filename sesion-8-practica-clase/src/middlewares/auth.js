import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export function authJWT(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

  try {
    req.usuario = jwt.verify(token, config.jwtSecret);
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}