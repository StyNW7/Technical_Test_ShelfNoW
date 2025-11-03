/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Determine the API URL based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Auth interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    roles: string[];
  };
}

// Product interfaces
export interface Product {
  id: string;
  title: string;
  author: string;
  description: string;
  isbn?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  category: string;
  publisher?: string;
  publishedAt?: string;
  language: string;
  pages?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  title: string;
  author: string;
  description: string;
  isbn?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  category: string;
  publisher?: string;
  publishedAt?: string;
  language?: string;
  pages?: number;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Add Authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      headers,
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: `HTTP error! status: ${response.status}` 
      }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // ===== AUTH ENDPOINTS =====
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile(): Promise<any> {
    return this.request<any>('/auth/profile');
  }

  async validateToken(): Promise<{ valid: boolean; user?: any }> {
    return this.request<{ valid: boolean; user?: any }>('/auth/validate', {
      method: 'POST',
    });
  }

  // ===== PRODUCT ENDPOINTS (Public) =====
  async getProducts(
    page: number = 1,
    limit: number = 12,
    category?: string,
    search?: string
  ): Promise<ProductsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(category && { category }),
      ...(search && { search }),
    });

    return this.request<ProductsResponse>(`/products?${params}`);
  }

  async getProduct(id: string): Promise<Product> {
    return this.request<Product>(`/products/${id}`);
  }

  async getCategories(): Promise<string[]> {
    return this.request<string[]>('/products/categories');
  }

  // ===== ADMIN PRODUCT ENDPOINTS =====
  async createProduct(productData: CreateProductRequest): Promise<Product> {
    return this.request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, productData: UpdateProductRequest): Promise<Product> {
    return this.request<Product>(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: string): Promise<void> {
    await this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    return this.request<Product>(`/products/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    });
  }

  async getAllProductsAdmin(
    page: number = 1,
    limit: number = 100,
    category?: string,
    search?: string
  ): Promise<ProductsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(category && { category }),
      ...(search && { search }),
    });

    return this.request<ProductsResponse>(`/products/admin/all?${params}`);
  }

  async getProductAdmin(id: string): Promise<Product> {
    return this.request<Product>(`/products/admin/${id}`);
  }

  // ===== ORDER ENDPOINTS =====
  async createOrder(orderData: any): Promise<any> {
    return this.request<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getUserOrders(): Promise<any[]> {
    return this.request<any[]>('/orders');
  }

  async getOrder(id: string): Promise<any> {
    return this.request<any>(`/orders/${id}`);
  }
}

export const apiService = new ApiService();