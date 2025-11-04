export interface Cart {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  cartItems: CartItem[];
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  price: number;
}

export interface AddToCartDto {
  productId: string;
  quantity: number;
  price: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

export interface CartSummary {
  totalItems: number;
  totalAmount: number;
  items: CartItem[];
}