// Lokasi: frontend/src/contexts/CartContext.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
// 1. Impor CreateOrderRequest
import { apiService, type Cart, type AddToCartRequest, type UpdateCartItemRequest, type CreateOrderRequest } from '@/services/api';
import { useAuth } from './AuthContext'; // Impor useAuth

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  addToCart: (productId: string, quantity: number, price: number) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  // ===== PERBAIKAN DI SINI (1) =====
  checkout: (orderData: CreateOrderRequest) => Promise<any>; // Tambahkan fungsi checkout
  // =============================
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
  const { isAuthenticated } = useAuth(); // Dapatkan status autentikasi

  const refreshCart = async () => {
    // Hanya refresh jika terotentikasi
    if (!isAuthenticated) {
      setCart(null);
      setLoading(false);
      return;
    }
    try {
      setError(null);
      setLoading(true);
      const cartData = await apiService.getCart();
      setCart(cartData);
    } catch (err: any) {
      console.error('Error fetching cart:', err);
      // Jangan set error untuk 401, AuthContext akan menanganinya
      if (err.message !== 'Authentication required. Please login again.') {
        setError(err.message || 'Failed to load cart');
      }
    } finally {
      setLoading(false);
    }
  };

  // Refresh keranjang saat status autentikasi berubah
  useEffect(() => {
    refreshCart();
  }, [isAuthenticated]);

  const addToCart = async (productId: string, quantity: number, price: number) => {
    try {
      setError(null);
      const cartData: AddToCartRequest = { productId, quantity, price };
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

  // ===== PERBAIKAN DI SINI (2) =====
  const checkout = async (orderData: CreateOrderRequest): Promise<any> => {
    try {
      setError(null);
      // 1. Panggil API untuk membuat pesanan
      const orderResponse = await apiService.createOrder(orderData);
      
      // 2. Refresh keranjang (yang sekarang seharusnya kosong)
      await refreshCart();
      
      return orderResponse;
    } catch (err: any) {
      console.error('Error during checkout:', err);
      setError(err.message || 'Checkout failed');
      throw err;
    }
  };
  // =============================

  // Hitung nilai turunan dari keranjang
  const cartItemCount = cart?.totalItems || 0;
  // Perbaikan: Gunakan reduce untuk total harga, bukan totalItems
  const totalPrice = cart?.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const totalItems = cart?.totalItems || 0;
  const items = cart?.items?.map(item => ({
    id: item.id,
    productId: item.productId,
    // Kita harus menangani jika produk tidak ada (meskipun seharusnya ada)
    bookTitle: item.product?.title || 'Produk tidak tersedia',
    bookAuthor: item.product?.author || 'N/A',
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
    checkout, // Ekspor fungsi checkout
    cartItemCount,
    totalPrice,
    totalItems,
    items,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};