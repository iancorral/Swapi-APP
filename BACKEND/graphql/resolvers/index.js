const db = require('../../database/db');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../../auth');
const { requireAuth, requireOwner } = require('../helpers/authHelpers');
const { validarContenido } = require('../helpers/filtroPalabras');
const { sendVerificationEmail } = require('../utils/mailer');

const resolvers = {
  Query: {
    usuarios: async () => await db.select().table('usuarios'),
    categorias: async () => await db.select().table('categorias'),
    anuncios: async () => await db.select().table('anuncios'),

    sp_UsuAnu: async (_, { uid }, context) => {
      requireAuth(context);
      if (context.user.id_usuario !== uid) {
        throw new Error('Acceso no autorizado al perfil');
      }
      const result = await db.raw('CALL sp_UsuAnu(?)', [uid]);
      return result[0][0];
    },

    sp_CatAnu: async () => {
      const result = await db.raw('CALL sp_CatAnu()');
      return result[0][0];
    },
  },

  Mutation: {
    addUsuario: async (_, { nombre, correo, contrasena }) => {
      if (!correo.endsWith('@ulsachihuahua.edu.mx')) {
        throw new Error('Solo se permiten correos institucionales @ulsachihuahua.edu.mx');
      }

      const existe = await db('usuarios').where({ correo }).first();
      if (existe) throw new Error('Ese correo ya está registrado');

      const hashedPassword = await bcrypt.hash(contrasena, 10);
      
      const codigo = Math.floor(100000 + Math.random() * 900000).toString();

      const [id_usuario] = await db('usuarios').insert({
        nombre,
        correo,
        contraseña: hashedPassword,
        codigo_verificacion: codigo,
        verificado: false
      });

      await sendVerificationEmail(correo, codigo);

      return await db('usuarios').where({ id_usuario }).first();
    },

    verificarCodigo: async (_, { correo, codigo }) => {
      const user = await db('usuarios').where({ correo }).first();
      if (!user) throw new Error('Correo no encontrado');
      if (user.verificado) throw new Error('Este usuario ya está verificado');

      if (user.codigo_verificacion !== codigo) {
        throw new Error('Código incorrecto');
      }

      await db('usuarios').where({ correo }).update({
        verificado: true,
        codigo_verificacion: null
      });

      return 'Cuenta verificada correctamente';
    },

    login: async (_, { correo, contrasena }) => {
      const user = await db('usuarios').where({ correo }).first();
      if (!user) throw new Error('Correo no encontrado');
      if (!user.verificado) throw new Error('La cuenta no ha sido verificada');

      const valid = await bcrypt.compare(contrasena, user.contraseña);
      if (!valid) throw new Error('Contraseña incorrecta');

      const token = generateToken(user);
      return { token };
    },

    updateUsuario: async (_, { id_usuario, nombre }, context) => {
      requireAuth(context);
      requireOwner(context, parseInt(id_usuario));
      await db('usuarios').where({ id_usuario }).update({ nombre });
      return await db('usuarios').where({ id_usuario }).first();
    },

    deleteUsuario: async (_, { id_usuario }, context) => {
      requireAuth(context);
      requireOwner(context, parseInt(id_usuario));
      return await db('usuarios').where({ id_usuario }).del();
    },

    addCategoria: async (_, { nombre }, context) => {
      requireAuth(context);
      const [id_categoria] = await db('categorias').insert({ nombre });
      return await db('categorias').where({ id_categoria }).first();
    },

    updateCategoria: async (_, { id_categoria, nombre }, context) => {
      requireAuth(context);
      await db('categorias').where({ id_categoria }).update({ nombre });
      return await db('categorias').where({ id_categoria }).first();
    },

    deleteCategoria: async (_, { id_categoria }) => {
      requireAuth(context);
      return await db('categorias').where({ id_categoria }).del();
    },

    addAnuncio: async (_, { titulo, descripcion, precio, id_usuario, id_categoria }, context) => {
      requireAuth(context);
      requireOwner(context, parseInt(id_usuario));
      validarContenido(descripcion);
      validarContenido(titulo);

      const [id_anuncio] = await db('anuncios').insert({
        titulo,
        descripcion,
        precio,
        id_usuario,
        id_categoria
      });
      return await db('anuncios').where({ id_anuncio }).first();
    },

    updateAnuncio: async (_, { id_anuncio, titulo, descripcion, precio, id_categoria }, context) => {
      requireAuth(context);
      const anuncio = await db('anuncios').where({ id_anuncio }).first();
      if (!anuncio) throw new Error("Anuncio no encontrado");
      requireOwner(context, anuncio.id_usuario);

      if (descripcion) {
        validarContenido(descripcion);
      }
      if (titulo) {
        validarContenido(titulo);
      }

      await db('anuncios').where({ id_anuncio }).update({
        titulo,
        descripcion,
        precio,
        id_categoria
      });
      return await db('anuncios').where({ id_anuncio }).first();
    },

    deleteAnuncio: async (_, { id_anuncio }, context) => {
      requireAuth(context);
      const anuncio = await db('anuncios').where({ id_anuncio }).first();
      if (!anuncio) throw new Error("Anuncio no encontrado");
      requireOwner(context, anuncio.id_usuario);
      return await db('anuncios').where({ id_anuncio }).del();
    }
  }
};

module.exports = resolvers;