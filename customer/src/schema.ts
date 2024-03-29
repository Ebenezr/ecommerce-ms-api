const typeDefs = `#graphql
  type Query {

    customer: Customer
      address(id: Int!): Address
    addresses: Address
      getCookieConsent: CookieConsent

  }
  type Mutation{
    signOut: Boolean
    signUp(input: SignUp!): SignUpResponse
    signIn(input: SignIn!): SignInResponse
    changePassword(input: changePassword!): ChangePasswordResponse
    # editCustomerData(input: Customer!): Customer
    editCustomerAddress(input: AddressInput!): Address
    addCustomerAddress(input: AddressInput!): Address
      # removeCustomerAddress(input: EntityIdInput!): Boolean
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
    type SignInResponse {
    status: Boolean
    message: String
  }
  input SignUp {
    name: String
    email: String
    phoneNumber: String
    password: String
    confirmPassword: String
    newsletter: Boolean
    autoSignIn: Boolean

  }
  input changePassword {
    email: String!
    password: String!

  }
  input SignIn {
    email: String!
    password: String!
  }


  input EmailInput {
    email: String!
  }

  input AddressInput {
    id: ID
    terms: Boolean
    firstName: String
    lastName: String
    city: String
    customerId: String
    email: String
    countryId: String
    defaultBilling: Boolean
    defaultShipping: Boolean
    region: String
    regionId: Int
    street: [String]
    telephone: String
  }

  input CustomerPassword {
    currentPassword: String!
    password: String!
  }

    type CustomerAttributes {
    attributeCode: String
    value: String
  }

  type CookieConsent {
    status: Boolean
  }

    type pagination {
    currentPage: Int
    pageSize: Int
    totalCount: Int
    perPage: Int
    nextPage: Int
  }

    type Customer {
    id: ID
    addresses: [CustomerAddress]
    defaultBilling: String
    defaultShipping: String
    email: String
    name: String
    phoneNumber: String
    newsletterSubscriber: Boolean
    customAttributes: [CustomerAttributes]

  }

  type CustomerAddress{
    id: ID
    terms: Boolean
    firstName: String
    lastName: String
    city: String
    customerId: String
    email: String
    countryId: String
  }

    type Address {
      status: Boolean

    message: String
  }

    type Region {
    id: ID
    name: String
    code: String!
  }

  type Country {
    englishName: String
    localName: String
    code: String!
    regions: [Region]
  }

  type CountryList {
    items: [Country]
  }


`;

export default typeDefs;
