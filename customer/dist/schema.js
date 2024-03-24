"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeDefs = `#graphql
  type Query {
    backendConfig: BackendConfig
  }
  type Mutation{
    signOut: Boolean
    signUp(input: SignUp!): SignUpResponse
    changePassword(input: changePassword!): ChangePasswordResponse
    signIn(input: SignIn!): Boolean
  }
  type BackendConfig {
    stripePublishableKey: String
  }
  type SignUpOtpResponse {
    status: Boolean
  }
  type ChangePasswordResponse {
    status: Boolean
    message: String
  }
  type SignUpResponse {
    status: Boolean
    message: String
  }
  input SignUp {
    email: String!
    password: String!
    name: String!
    phone: String!
  }
  input changePassword {
    email: String!
    password: String!
    otp: String!
  }
  input SignIn {
    email: String!
    password: String!
  }

`;
exports.default = typeDefs;
