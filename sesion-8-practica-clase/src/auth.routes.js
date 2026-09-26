import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export function authRoutes(usuarioRepo) {
  const router = Router();
  
  router.post('/registro', async (req, res, next) => {
    try {
      const hash = await bcrypt.hash(req.body.password, 10);
      const usuario = await usuarioRepo.crear({ email: req.body.email, password: hash });
      res.status(201).json({ id: usuario.id, email: usuario.email });
    } catch (e) { next(e); }
  });

  router.post('/login', async (req, res, next) => {
    try {
      const usuario = await usuarioRepo.buscarPorEmail(req.body.email);
      if (!usuario) return res.status(401).json({ error: 'Datos incorrectos' });
      
      const coincide = await bcrypt.compare(req.body.password, usuario.password);
      if (!coincide) return res.status(401).json({ error: 'Datos incorrectos' });

      const token = jwt.sign({ sub: usuario.id }, config.jwtSecret, { expiresIn: '1h' });
      res.json({ token });
    } catch (e) { next(e); }
  });
  return router;
}