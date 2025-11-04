/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { apiService, type Cart, type AddToCartRequest, type UpdateCartItemRequest } from '@/services/api';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  cartItemCount: number;
  totalPrice: number;
  totalItems: number;
  items: any[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCart = async () => {
    try {
      setError(null);
      setLoading(true);
      const cartData = await apiService.getCart();
      setCart(cartData);
    } catch (err: any) {
      console.error('Error fetching cart:', err);
      // Don't set error for 401 - user might not be logged in
      if (err.message !== 'Authentication required') {
        setError(err.message || 'Failed to load cart');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addToCart = async (productId: string, quantity: number) => {
    try {
      setError(null);
      const cartData: AddToCartRequest = { productId, quantity };
      const updatedCart = await apiService.addToCart(cartData);
      setCart(updatedCart);
    } catch (err: any) {
      console.error('Error adding to cart:', err);
      setError(err.message || 'Failed to add item to cart');
      throw err;
    }
  };

  const updateCartItem = async (itemId: string, quantity: number) => {
    try {
      setError(null);
      const updateData: UpdateCartItemRequest = { quantity };
      const updatedCart = await apiService.updateCartItem(itemId, updateData);
      setCart(updatedCart);
    } catch (err: any) {
      console.error('Error updating cart item:', err);
      setError(err.message || 'Failed to update cart item');
      throw err;
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      setError(null);
      const updatedCart = await apiService.removeFromCart(itemId);
      setCart(updatedCart);
    } catch (err: any) {
      console.error('Error removing from cart:', err);
      setError(err.message || 'Failed to remove item from cart');
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      const updatedCart = await apiService.clearCart();
      setCart(updatedCart);
    } catch (err: any) {
      console.error('Error clearing cart:', err);
      setError(err.message || 'Failed to clear cart');
      throw err;
    }
  };

  // Calculate derived values from cart
  const cartItemCount = cart?.totalItems || 0;
  const totalPrice = cart?.totalItems || 0;
  const totalItems = cart?.totalItems || 0;
  const items = cart?.items?.map(item => ({
    id: item.id,
    productId: item.productId,
    bookTitle: item.product?.title || 'Unknown Book',
    bookAuthor: item.product?.author || 'Unknown Author',
    bookImage: item.product?.imageUrl,
    price: item.price,
    quantity: item.quantity,
    stock: item.product?.stock || 0,
  })) || [];

  const value: CartContextType = {
    cart,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
    cartItemCount,
    totalPrice,
    totalItems,
    items,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};