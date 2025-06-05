const { ApolloServer } = require('apollo-server');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { verifyToken } = require('./auth'); // Asegúrate de tener esta función
require('dotenv').config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Leer el token del header
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1]; // "Bearer token123" → token123

    // Verificar el token (si existe)
    if (token) {
      try {
        const user = verifyToken(token); // función que decodifica y valida
        return { user }; // este 'user' estará disponible en todos los resolvers
      } catch (error) {
        console.error('Token inválido:', error.message);
      }
    }

    return {}; // sin token o inválido, context queda vacío
  }
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
