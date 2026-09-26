import { Sequelize } from 'sequelize';
import pg from 'pg';
import { config } from '../config.js';

export const sequelize = new Sequelize(config.db, { logging: false });
export const pool = new pg.Pool({ connectionString: config.db });