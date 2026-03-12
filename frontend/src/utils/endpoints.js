export const API_ENDPOINTS = { 
  // AUTH
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",

  // USER
  PROFILE: "/user/profile",
  UPDATE_PROFILE: "/user/update",

  // PRODUCTS
  PRODUCTS: "/products",
  ORDERS: "/orders",
  PRODUCT_DETAILS: (id) => `/products/${id}`,

  // CART
  CART: "/cart",
  ADD_TO_CART: "/cart",
  REMOVE_ALL_CART: "/cart-remove",
  REMOVE_FROM_CART: (id) => `/cart/${id}`,

};