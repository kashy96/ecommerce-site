export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: 'RELEVANCE' | 'BEST_SELLING' | 'CREATED_AT' | 'PRICE';
  reverse: boolean;
};

export const defaultSort: SortFilterItem = {
  title: 'Relevance',
  slug: null,
  sortKey: 'RELEVANCE',
  reverse: false
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  { title: 'Trending', slug: 'trending-desc', sortKey: 'BEST_SELLING', reverse: false }, // asc
  { title: 'Latest arrivals', slug: 'latest-desc', sortKey: 'CREATED_AT', reverse: true },
  { title: 'Price: Low to high', slug: 'price-asc', sortKey: 'PRICE', reverse: false }, // asc
  { title: 'Price: High to low', slug: 'price-desc', sortKey: 'PRICE', reverse: true }
];

export const TAGS = {
  collections: 'collections',
  products: 'products',
  cart: 'cart'
};

export const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;
export const APP_URL = `${process.env.NEXT_PUBLIC_API_URL}`;
export const LOGIN_URL = API_URL + "/auth/login";
export const LOGOUT_URL = API_URL + "/auth/logout";
export const REGISTER_URL = API_URL + "/auth/register";
export const CHECK_CREDENTIALS = API_URL + "/auth/checkCredentials";
export const CATEGORY_URL = API_URL + "/category";
export const PRODUCT_URL = API_URL + "/product";
export const CART_URL = API_URL + "/cart";
export const ORDER_URL = API_URL + "/orders";
