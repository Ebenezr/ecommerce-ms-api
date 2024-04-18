const typeDefs = `#graphql
  type Query {
    cart: Cart
    lastOrder: Order
        orders(perPage: Int!, page: Int): Orders
          shippingEstimates(shipType: String!, dispatchType: String!): ShippingOptions
    splitShippingEstimates(shipType: String!): SplitShippingOptions
      isValidCheckoutToken: Boolean!
    getStoreCredit: StoreCredit
    getSessionProductLikes: ProductLikes
  }
  type Mutation{
    addToCart(input: AddToCartInput!): CartItemPayload
    updateCartItem(input: UpdateCartItemInput!): CartItemPayload
    removeCartItem(input: RemoveCartItemInput!): RemoveCartItemResponse
    reOrder(input: ReorderInput!): ReorderResponse
    applyCoupon(input: CouponInput!): Boolean
    cancelCoupon: Boolean
    applyStoreCredit: Boolean
    cancelGiftCard(giftCard: String): Boolean
    cancelStoreCredit: StoreCredit
    checkoutSession(input: CheckoutSession!): Boolean
      setShipping(input: ShippingInput): ShippingInformation
    placeOrder(input: PlaceOrderInput!): PlaceOrderResult
  }
  input AddToCartInput {
    sku: String!
    qty: Float!
    configurableOptions: [ConfigurableOptionInput]
    bundleOptions: [BundleOptionInput]
  }

    input UpdateCartItemInput {
    itemId: Int!

    sku: String!
    qty: Float!
  }
    input RemoveCartItemInput {
    itemId: Int!
  }

    input CouponInput {
    couponCode: String!
  }

  type CartItemPayload {
    itemId: Int!
    sku: String
    qty: Float
    name: String
    price: Float
    productType: String
    entityId: Int
  }

  type RemoveCartItemResponse {
    itemId: Int
  }

  type Cart {
    active: Boolean
    virtual: Boolean
    items: [CartItem]
    itemsCount: Int
    itemsQty: Int
    jisortPaid: String
    totals: [CartTotal]
    quoteCurrency: String
    couponCode: String
    totalJisortValue: String
    billingAddress: Address
    giftCards: [GiftCards]
  }
    type CartItem {
    quoteId: Int
    itemId: Int!
    sku: String!
    qty: Float!
    name: String
    availableQty: Float
    price: Float
    productType: String
    priceInclTax: Float
    rowTotal: Float
    rowTotalInclTax: Float
    rowTotalWithDiscount: Float
    taxAmount: Float
    taxPercent: Float
    discountAmount: Float
    discountPercent: Float
    weeeTaxAmount: Float
    weeeTaxApplied: Boolean
    thumbnailUrl: String
    urlKey: String
    link: String
    campaignId: String
    jisortValue: String
    jisortRate: String
    jisortPaid: String
    itemOptions: [CartItemOption]
  }

    type OrderItem {
    itemId: Int!
    productId: Int
    sku: String!
    qty: Float!
    name: String
    status: String
    orderTracking: [OrderTracking]
    availableQty: Float
    price: Float
    productType: String
    rowTotalInclTax: Float
    basePrice: Float
    basePriceInclTax: Float
    thumbnailUrl: String
    urlKey: String
    link: String
    parentItem: OrderItem
  }

  type StoreCredit {
    status: Boolean
    storeCredit: Float
  }

    type Orders {
    items: [Order]!
    pagination: pagination
  }

  type Order {
    incrementId: String!
    entityId: Int
    createdAt: String
    deliveryDate: String
    customerFirstname: String
    customerLastname: String
    status: String
    orderCurrencyCode: String
    baseGrandTotal: String
    subtotal: String
    shippingAmount: String
    taxAmount: String
    discountAmount: String
    grandTotal: String
    items: [OrderItem]
    orderTracking: [OrderTracking]
    orderOtp: String
    orderNote: String
    shippingDescription: String
    paymentMethodName: String
    deliveryMethod: String
    shippingAddress: Address
    billingAddress: Address
    couponCode: String
  }

    type OrderTracking {
    status: String
    createdAt: String
    createdAtDate: String
    createdAtTime: String
  }

  type PlaceOrderResult {
    orderId: Int
    orderRealId: String
  }
`;

export default typeDefs;
