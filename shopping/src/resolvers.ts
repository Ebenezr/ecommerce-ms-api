const resolvers = {
  Query: {
    getCart: () => {
      return {
        products: [],
      };
    },
  },
  Mutation: {
    addToCart: (_, { productId }) => {
      return {
        products: [
          {
            id: productId,
            name: 'Product 1',
            price: 9.99,
          },
        ],
      };
    },
  },
};

export default resolvers;
