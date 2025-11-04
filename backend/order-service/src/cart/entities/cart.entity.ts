export class Cart {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  cartItems: CartItem[];
}

export class CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  price: number;
}