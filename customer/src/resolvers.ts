const resolvers = {
  Query: {
    backendConfig: (_: any, __: any, { dataSources }: { dataSources: any }) =>
      dataSources.customerAPI.getBackendConfig(),
    customer: (_: any, __: any, { dataSources }: { dataSources: any }) =>
      dataSources.customerAPI.customer(),
  },
  Mutation: {
    signIn: (
      _: any,
      { input }: { input: any },
      { dataSources }: { dataSources: any }
    ) => dataSources.customerAPI.signIn(input),
    signUp: (
      _: any,
      { input }: { input: any },
      { dataSources }: { dataSources: any }
    ) => dataSources.customerAPI.signUp(input),
    signOut: (_: any, __: any, { dataSources }: { dataSources: any }) =>
      dataSources.customerAPI.signOut(),
  },
};

export default resolvers;
