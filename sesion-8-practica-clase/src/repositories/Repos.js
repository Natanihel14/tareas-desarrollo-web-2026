export class CursosRepo {
  constructor(modelo) { this.modelo = modelo; }
  async listar() { return this.modelo.findAll(); }
  async crear(datos) { return this.modelo.create(datos); }
}

export class UsuariosRepo {
  constructor(modelo) { this.modelo = modelo; }
  async buscarPorEmail(email) { return this.modelo.findOne({ where: { email } }); }
  async crear(datos) { return this.modelo.create(datos); }
}