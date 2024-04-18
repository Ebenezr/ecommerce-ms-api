const typeDefs = `#graphql
  type Query {
    getCart: Cart
  }
  type Mutation{
    addToCart(productId: ID!): Cart
  }
  type Product {
    id: ID!
    name: String!
    price: Float!
  }
  type Cart {
    products: [Product]
  }
`;

export default typeDefs;
