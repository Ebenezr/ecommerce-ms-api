const { startApolloServer } = require('./server');

async function main() {
  try {
    const { httpServer } = await startApolloServer();

    if (process.env.NODE_ENV !== 'test') {
      await new Promise((resolve) =>
        httpServer.listen({ port: process.env.SERVER_PORT || 4000 }, resolve)
      );
      console.log(
        `🚀 Server ready at http://localhost:${process.env.SERVER_PORT || 4000}`
      );
    }
  } catch (error) {
    console.error('Error starting server:', error);
  }
}

main();

module.exports = main;
