const typeDefs = `#graphql
  type Query {
      category(id: Int!): Category
    categoryPage(
      categoryId: Int
      includeSubcategories: Boolean
      query: ShopPageQuery
      sortOrders: [SortOrderInput]
      priceFilter: [PriceFilter]
      filters: [Filter]
      path: String!
    ): CategoryPage
    product(path: String): Product
    products(
      categoryId: Int
      includeSubcategories: Boolean
      query: ShopPageQuery
      filters: [Filter]
      priceFilter: [PriceFilter]
      skus: [String]
      entityId: [Int]
    ): ProductList
    search(searchTerm: String!): ProductList
    recommendedProducts(sku: String!): Recommended
    alsoViewed(sku: String!): AlsoViewed
      productReviews(sku: String!): ProductReviews
      getSessionProductLikes: ProductLikes
        productListingFilters(id: Int!): Filters
    productListingFilterItem: ProductListingFilterItem
    productPopUp: popUpProduct


  }
  type Mutation{
      saveProductLike(productId: Int!, likesCount: Int!): ProductLikeResult
    removeProductLike(productId: Int!): Boolean

  }

    type Product {
    id: Int!
    sku: String!
    name: String!
    typeId: String
    image: String
    urlPath: String
    # Full url to resized product image
    thumbnail: String
    priceType: String
    price: String
    minPrice: String
    maxPrice: String
    specialPrice: String
    returnsPolicy: String
    warranty: String
    rating: Int
    likes: Int
    vendorName: String
    newsToDate: String
    currency: String
    description: String
    shortDescription: String
    stock: Stock
    type: String
    configurableOptions: [ConfigurableProductOption]
    bundleOptions: [BundleProductOption]
    gallery: [GalleryEntry]
    breadcrumbs: [Breadcrumb]
    seo: ProductSeo
    deviceFinancing: Int
    campaign: [Campaign]
  }

  type Campaign {
    campaignName: String
    bongaRate: Float
    bongaValue: Int
    startDate: String
    endDate: String
  }

    type ConfigurableProductOption {
    id: String
    attributeId: String
    label: String
    position: String
    productId: String
    values: [ConfigurableProductOptionValue]
  }

    type BundleProductOption {
    optionId: Int
    position: Int
    productLinks: [BundleProductOptionLink]
    required: Boolean
    sku: String
    title: String
    type: String
  }

  type GalleryEntry {
    type: String!
    full: String!
    thumbnail: String
    embedUrl: String
  }

    type Breadcrumb {
    id: Int
    name: String
    urlPath: String
    urlKey: String
    urlQuery: String
  }

type ProductLikeResult {
    status: Boolean
    count: Int
    message: String
  }

  type ProductLikes {
    likedProducts: [Int]
  }

    type ProductList {
    items: [Product]!
    aggregations: [Aggregation]
    pagination: pagination
  }

  type CategoryPage {
    entityType: String
    entityId: Int
    cmsPage: String
    product: String
    name: String
    items: [Product]
    categoryBanners: [categoryBanner]
    urlPath: String
    pagination: pagination
    filters: [ProductListingFilterItem]
    sortOrders: [sortOrder]
    seo: ProductSeo
  }

    type pagination {
    currentPage: Int
    pageSize: Int
    totalCount: Int
    perPage: Int
    nextPage: Int
  }


  type CmsWidgetData {
    section: Int
    title: String
    products_count: Int
    image: String
    template: String
    alt_text: String
    main_image: String
    medium_image: String
    medium_image_alt: String
    small_image: String
    small_image_alt: String
    mobile_sorting: String
    mobile_enabled: Int
    url: String
    bg_color: String
    text_color: String
    content: [CarouselList]
  }

  type newCmsWidgetData {
    section: Int
    title: String
    products_count: Int
    image: String
    template: String
    alt_text: String
    main_image: String
    medium_image: String
    medium_image_alt: String
    small_image: String
    small_image_alt: String
    mobile_sorting: String
    mobile_enabled: Int
    url: String
    bg_color: String
    text_color: String
    content: [CarouselList]
    widgetProducts: [Product]
  }
    type CarouselList {
    image: String
    image_medium: String
    image_small: String
    item_url: String
  }

  type Recommended {
    items: [Product]
  }

  type AlsoViewed {
    items: [Product]
  }

  type WidgetProducts {
    items: [Product]
  }


  type categoryBannerData {
    template: String
    image: String
    alt_text: String
    main_image: String
    medium_image: String
    medium_image_alt: String
    small_image: String
    small_image_alt: String
    mobile_sorting: String
    mobile_enabled: Int
    text_one: String
    text_two: String
    loadtype: String
    text_position: String
    url: String
    products_count: Int
    products_content: [Product]
    bg_color: String
    text_color: String
    css_class: String
    section: Int
    content: [CarouselList]
  }


  type Filters {
    filters: [ProductListingFilterItem]
  }

  type ProductListingFilterItem {
    name: String!
    code: String!
    items: [FilterItems]
  }


  type ProductReviews {
    reviews: [ProductReviewItem]
  }

  type ProductReviewItem {
    reviewId: String
    createdAt: String
    title: String
    detail: String
    nickName: String
    value: String
  }

  type ProductSeo {
    title: String
    description: String
    keywords: String
  }
    type popUpProduct {
    popUpImage: String
    itemUrl: String
  }

    input Search {
    searchTerm: String
  }

  type SearchResults {
    items: [SearchProduct]
  }

  type SearchProduct {
    id: Int
  }

  input Review {
    nickName: String
    productId: Int
    customerId: Int
    title: String
    description: String
    ratingOption: Int
  }


  type ConfigurableProductOption {
    id: String
    attributeId: String
    label: String
    position: String
    productId: String
    values: [ConfigurableProductOptionValue]
  }

  type ConfigurableProductOptionValue {
    inStock: [String]
    label: String
    valueIndex: String
  }

  type BundleProductOption {
    optionId: Int
    position: Int
    productLinks: [BundleProductOptionLink]
    required: Boolean
    sku: String
    title: String
    type: String
  }

  type BundleProductOptionLink {
    canChangeQuantity: Int
    name: String
    catalogDisplayPrice: String
    id: String
    isDefault: Boolean
    optionId: Int
    position: Int
    price: String
    priceType: String
    qty: Int
    sku: String
  }


`;

export default typeDefs;
