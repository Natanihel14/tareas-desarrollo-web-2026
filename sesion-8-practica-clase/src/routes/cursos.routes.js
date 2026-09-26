import { Router } from 'express';
import fs from 'fs/promises';
import { validarCurso, revisarErrores } from '../validators/cursoValidator.js';
import { authJWT } from '../middlewares/auth.js';

async function escribirLog(msj) {
  await fs.appendFile('historial.log', `[LOG] ${new Date().toISOString()} - ${msj}\n`);
}

export function cursosRoutes(repo) {
  const router = Router();
  
  router.get('/', async (req, res, next) => {
    try { res.json(await repo.listar()); } catch (e) { next(e); }
  });

  router.post('/', authJWT, validarCurso, revisarErrores, async (req, res, next) => {
    try {
      const curso = await repo.crear(req.body);
      escribirLog(`Se creo el curso: ${curso.nombre}`).catch(e => console.error('Fallo log:', e));
      res.status(201).json(curso);
    } catch (e) { next(e); }
  });
  return router;
}