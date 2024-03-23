"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeDefs = `#graphql
  type Query {
    backendConfig: BackendConfig
  }
type Mutation{
      signOut: Boolean
}

    type BackendConfig {
        stripePublishableKey: String
    }

`;
exports.default = typeDefs;
