const { ApolloServer } = require('apollo-server');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { verifyToken } = require('./auth'); 
require('dotenv').config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {

    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1]; 

    if (token) {
      try {
        const user = verifyToken(token); 
        return { user }; 
      } catch (error) {
        console.error('Token inválido:', error.message);
      }
    }

    return {};
  }
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});