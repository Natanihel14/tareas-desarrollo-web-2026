import { DataTypes } from 'sequelize';
import { sequelize } from '../db/sequelize.js';

export const Curso = sequelize.define('curso', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  codigoUnico: { type: DataTypes.STRING, allowNull: false, unique: true },
  creditos: { type: DataTypes.INTEGER, allowNull: false }
});

export const Usuario = sequelize.define('usuario', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false }
});