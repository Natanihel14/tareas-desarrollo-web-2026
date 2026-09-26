import { body, validationResult } from 'express-validator';

export const validarCurso = [
  body('nombre').trim().notEmpty().withMessage('Nombre obligatorio'),
  body('codigoUnico').trim().notEmpty().withMessage('Código obligatorio'),
  body('creditos').isInt({ min: 1 }).withMessage('Créditos no válidos'),
];

export function revisarErrores(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errores: errores.array() });
  next();
}
