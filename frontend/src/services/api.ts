/* eslint-disable @typescript-eslint/no-unused-vars */
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
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
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
    const token = localStorage.getItem('access_token');
    console.log('ApiService: Retrieved token from localStorage', { 
      hasToken: !!token,
      tokenLength: token?.length 
    });
    return token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getAuthToken();
    
    console.log('ApiService: Making request', { 
      url, 
      hasToken: !!token,
      method: options.method || 'GET'
    });

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('ApiService: Added Authorization header');
    } else {
      console.warn('ApiService: No token available for request');
    }

    try {
      const response = await fetch(url, {
        headers,
        credentials: 'include',
        ...options,
      });

      console.log('ApiService: Response received', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });

      // Handle unauthorized responses
      if (response.status === 401) {
        console.error('ApiService: Unauthorized - clearing auth data');
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('storage'));
        throw new Error('Authentication required. Please login again.');
      }

      // Handle forbidden responses
      if (response.status === 403) {
        const errorText = await response.text();
        console.error('ApiService: Forbidden access', { errorText });
        throw new Error('Insufficient permissions to access this resource.');
      }

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
          console.error('ApiService: Error response JSON', errorData);
        } catch {
          try {
            const errorText = await response.text();
            if (errorText) {
              errorMessage = errorText;
            }
          } catch {
            // Ignore text parsing errors
          }
        }
        
        throw new Error(errorMessage);
      }

      // If response is OK, try to parse as JSON
      try {
        // For 204 No Content responses
        if (response.status === 204 || response.headers.get('content-length') === '0') {
          return {} as T;
        }
        
        const data = await response.json();
        console.log('ApiService: Request successful', { data: data ? 'data received' : 'no data' });
        return data;
      } catch (jsonError) {
        console.error('ApiService: JSON parsing error', jsonError);
        throw new Error('Server returned invalid JSON response');
      }
      
    } catch (error: any) {
      console.error('ApiService: Request failed', error);
      if (error.message.includes('CORS') || error.message.includes('Network')) {
        throw new Error('Cannot connect to server. Please check if the API Gateway is running.');
      }
      throw error;
    }
  }

  // ===== AUTH ENDPOINTS =====
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    console.log('ApiService: Attempting login', { email: credentials.email });
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Ensure response has the expected structure
    if (!response.user || !response.access_token) {
      console.error('ApiService: Invalid login response', response);
      throw new Error('Invalid response from server');
    }

    // Ensure user has role
    if (!response.user.role) {
      response.user.role = 'USER';
      console.log('ApiService: Default role assigned to user');
    }

    console.log('ApiService: Login successful', { 
      userId: response.user.id, 
      role: response.user.role 
    });
    return response;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    console.log('ApiService: Attempting registration', { email: userData.email });
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (!response.user || !response.access_token) {
      console.error('ApiService: Invalid registration response', response);
      throw new Error('Invalid response from server');
    }

    if (!response.user.role) {
      response.user.role = 'USER';
    }

    return response;
  }

  async getProfile(): Promise<any> {
    return this.request<any>('/auth/profile');
  }

  async validateToken(): Promise<{ valid: boolean; user?: any; error?: string }> {
    try {
      console.log('ApiService: Validating token');
      const response = await this.request<{ valid: boolean; user?: any; error?: string }>('/auth/validate', {
        method: 'POST',
      });

      console.log('ApiService: Token validation result', response);
      return response;
    } catch (error: any) {
      console.error('ApiService: Token validation request failed:', error);
      return { valid: false, error: error.message };
    }
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

    console.log('ApiService: Fetching products', { page, limit, category, search });
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
    console.log('ApiService: Creating product', productData);
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
    return this.request<any[]>('/orders/my-orders');
  }

  async getOrder(id: string): Promise<any> {
    return this.request<any>(`/orders/${id}`);
  }
}

export const apiService = new ApiService();