const PRODUCT_API_URL = import.meta.env.VITE_PRODUCT_API_URL || 'http://localhost:3002';

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

export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class ProductApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${PRODUCT_API_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: 'Network error' 
      }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

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
}

export const productApiService = new ProductApiService();