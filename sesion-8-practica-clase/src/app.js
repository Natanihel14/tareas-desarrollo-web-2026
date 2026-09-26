import express from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { config } from './config.js';
import { sequelize, pool } from './db/sequelize.js';
import { Curso, Usuario } from './models/Modelos.js';
import { CursosRepo, UsuariosRepo } from './repositories/Repos.js';
import { authRoutes } from './routes/auth.routes.js';
import { cursosRoutes } from './routes/cursos.routes.js';

const app = express();
app.use(express.json());

// Sesiones en Postgres
const PgStore = connectPgSimple(session);
app.use(session({
  store: new PgStore({ pool, tableName: 'sesiones', createTableIfMissing: true }),
  secret: config.sessionSecret,
  resave: false, saveUninitialized: false,
  cookie: { httpOnly: true }
}));

const repoCursos = new CursosRepo(Curso);
const repoUsuarios = new UsuariosRepo(Usuario);

app.use('/auth', authRoutes(repoUsuarios));
app.use('/cursos', cursosRoutes(repoCursos));

sequelize.sync({ alter: true }).then(() => {
  app.listen(config.puerto, () => console.log(`🚀 Servidor en puerto ${config.puerto}`));
});