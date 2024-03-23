const resolvers = {
  Query: {},
  Mutation: {
    signOut: async (parent: any, args: any, context: any) => {
      context.res.clearCookie('token');
      return true;
    },
  },
};

export default resolvers;
