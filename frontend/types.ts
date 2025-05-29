export type User = {
    // user: any;
    id: string;
    // name: string;
    email: string;
    token: string;
    role: string;
    created_at: string;
};

export type Category = {
    _id: string;
    name: string;
    slug: string;
    created_at: string;
}

export type Product = {
    _id: string;
    name: string;
    description: string;
    slug: string,
    price: number;
    stock: number;  
    image: string;
    category: Category;
    createdAt: string;
}

export interface ProductData {
    name: string;
    description: string;
    category: string;
    stock: string;
    price: string;
    image?: File | null;
}

export interface CustomerInfo {
    name: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

export interface Order {
    orderId: string;
    sessionId: string;
    customerInfo: CustomerInfo;
    items: CartItem[];
    totalAmount: number;
    status: 'pending' | 'paid' | 'fulfilled' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}

export interface CheckoutSessionResponse {
    url: string;
}

export interface OrderDetailsResponse {
    orderId: string;
    email: string;
    amount: string;
    status: string;
}

export interface CartItem {
    productId: string;
    quantity: number;
    price: number;
    total: number;
    name?: string;
    image?: string;
}
  
export interface Cart {
    userId: string;
    items: CartItem[];
    subTotal: number;
}
  