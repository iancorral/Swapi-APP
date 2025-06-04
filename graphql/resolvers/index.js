const db = require('../../database/db');

const resolvers = {
  Query: {
    // Stored Procedures
    sp_UsuAnu: async (_, { uid }) => {
      const result = await db.raw('CALL sp_UsuAnu(?)', [uid]);
      return result[0][0];
    },

    sp_CatAnu: async () => {
      const result = await db.raw('CALL sp_CatAnu()');
      return result[0][0];
    },

    // Queries para mostrar tablas completas
    usuarios: async () => await db.select().table('usuarios'),
    categorias: async () => await db.select().table('categorias'),
    anuncios: async () => await db.select().table('anuncios'),
    imagenes: async () => await db.select().table('imagenes')
  },

  Mutation: {
    // --- Usuarios ---
    addUsuario: async (_, { nombre, correo, contrasena }) => {
      const [id_usuario] = await db('usuarios').insert({
        nombre,
        correo,
        contraseña: contrasena
      });
      return await db('usuarios').where({ id_usuario }).first();
    },

    updateUsuario: async (_, { id_usuario, nombre }) => {
      await db('usuarios').where({ id_usuario }).update({ nombre });
      return await db('usuarios').where({ id_usuario }).first();
    },

    deleteUsuario: async (_, { id_usuario }) => {
      return await db('usuarios').where({ id_usuario }).del();
    },

    // --- Categorias ---
    addCategoria: async (_, { nombre }) => {
      const [id_categoria] = await db('categorias').insert({ nombre });
      return await db('categorias').where({ id_categoria }).first();
    },

    updateCategoria: async (_, { id_categoria, nombre }) => {
      await db('categorias').where({ id_categoria }).update({ nombre });
      return await db('categorias').where({ id_categoria }).first();
    },

    deleteCategoria: async (_, { id_categoria }) => {
      return await db('categorias').where({ id_categoria }).del();
    },

    // --- Anuncios ---
    addAnuncio: async (_, { titulo, descripcion, precio, id_usuario, id_categoria }) => {
      const [id_anuncio] = await db('anuncios').insert({
        titulo,
        descripcion,
        precio,
        id_usuario,
        id_categoria
      });
      return await db('anuncios').where({ id_anuncio }).first();
    },

    updateAnuncio: async (_, { id_anuncio, titulo, descripcion, precio, id_categoria }) => {
      await db('anuncios').where({ id_anuncio }).update({
        titulo,
        descripcion,
        precio,
        id_categoria
      });
      return await db('anuncios').where({ id_anuncio }).first();
    },

    deleteAnuncio: async (_, { id_anuncio }) => {
      return await db('anuncios').where({ id_anuncio }).del();
    }
  }
};

module.exports = resolvers;