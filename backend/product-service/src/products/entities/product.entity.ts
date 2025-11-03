export class Product {
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
  publishedAt?: Date;
  language: string;
  pages?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}