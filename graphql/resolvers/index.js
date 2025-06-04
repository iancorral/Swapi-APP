// graphql/resolvers/index.js
const db = require('../../database/db');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../../auth');

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
    imagenes: async () => await db.select().table('imagenes'),

    // Perfil del usuario autenticado
    perfilUsuario: async (_, __, context) => {
      if (!context.user) throw new Error('No autenticado');
      return await db('usuarios').where({ id_usuario: context.user.id_usuario }).first();
    }
  },

  Mutation: {
    // --- Usuarios ---
    addUsuario: async (_, { nombre, correo, contrasena }) => {
      const hashedPassword = await bcrypt.hash(contrasena, 10);
      const [id_usuario] = await db('usuarios').insert({
        nombre,
        correo,
        contraseña: hashedPassword
      });
      return await db('usuarios').where({ id_usuario }).first();
    },

    login: async (_, { correo, contrasena }) => {
      const user = await db('usuarios').where({ correo }).first();
      if (!user) throw new Error('Correo no encontrado');

      const valid = await bcrypt.compare(contrasena, user.contraseña);
      if (!valid) throw new Error('Contraseña incorrecta');

      const token = generateToken(user);
      return { token };
    },

    updateUsuario: async (_, { id_usuario, nombre }, context) => {
      if (!context.user || context.user.id_usuario !== parseInt(id_usuario)) {
        throw new Error("Acceso no autorizado");
      }
      await db('usuarios').where({ id_usuario }).update({ nombre });
      return await db('usuarios').where({ id_usuario }).first();
    },

    deleteUsuario: async (_, { id_usuario }, context) => {
      if (!context.user || context.user.id_usuario !== parseInt(id_usuario)) {
        throw new Error("Acceso no autorizado");
      }
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
      const palabrasProhibidas = ['sexo', 'drogas', 'suicidio'];
      for (const palabra of palabrasProhibidas) {
        if (descripcion.toLowerCase().includes(palabra)) {
          throw new Error("La descripción contiene palabras no permitidas");
        }
      }
      if (descripcion.length < 15) {
        throw new Error("La descripción debe tener al menos 15 caracteres");
      }
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