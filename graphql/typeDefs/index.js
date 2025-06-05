const { gql } = require('apollo-server');

const typeDefs = gql`
  type Usuario {
    id_usuario: ID!
    nombre: String!
    correo: String!
  }

  type Categoria {
    id_categoria: ID!
    nombre: String!
  }

  type Anuncio {
    id_anuncio: ID!
    titulo: String!
    descripcion: String!
    precio: Float
    id_usuario: Int!
    id_categoria: Int!
  }

  type Imagen {
    id_imagen: ID!
    url: String!
    id_anuncio: Int!
  }

  type UsuarioAnuncio {
    id_usuario: Int!
    nombre_usuario: String!
    id_anuncio: Int!
    titulo: String!
    descripcion: String!
    precio: Float
    categoria: String!
  }

  type CategoriaAnuncio {
    categoria: String!
    id_anuncio: Int!
    titulo: String!
    descripcion: String!
    precio: Float
  }

  type AuthPayload {
    token: String!
  }

  type Query {
    sp_UsuAnu(uid: Int!): [UsuarioAnuncio!]!
    sp_CatAnu: [CategoriaAnuncio!]!
    usuarios: [Usuario!]!
    categorias: [Categoria!]!
    anuncios: [Anuncio!]!
    imagenes: [Imagen!]!
    perfilUsuario: Usuario!
  }

  type Mutation {
    addUsuario(nombre: String!, correo: String!, contrasena: String!): Usuario!
    login(correo: String!, contrasena: String!): AuthPayload!
    updateUsuario(id_usuario: ID!, nombre: String): Usuario!
    deleteUsuario(id_usuario: ID!): Int!

    addCategoria(nombre: String!): Categoria!
    updateCategoria(id_categoria: ID!, nombre: String): Categoria!
    deleteCategoria(id_categoria: ID!): Int!

    addAnuncio(titulo: String!, descripcion: String!, precio: Float, id_usuario: Int!, id_categoria: Int!): Anuncio!
    updateAnuncio(id_anuncio: ID!, titulo: String, descripcion: String, precio: Float, id_categoria: Int): Anuncio!
    deleteAnuncio(id_anuncio: ID!): Int!

    verificarCodigo(correo: String!, codigo: String!): String!
  }
`;

module.exports = typeDefs;
