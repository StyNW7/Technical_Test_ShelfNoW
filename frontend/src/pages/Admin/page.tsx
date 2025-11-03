/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useMemo, useEffect } from 'react';
import { BookOpen, Plus, Edit2, Trash2, Search, Package, Zap, Menu, X, Home, User, LogOut } from 'lucide-react';
import BookForm from '@/components/admin/book-form';

interface Book {
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
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  products: Book[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Mock data for demo purposes
const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A classic novel about the American Dream',
    isbn: '9780743273565',
    price: 15.99,
    stock: 25,
    category: 'Fiction',
    publisher: 'Scribner',
    language: 'English',
    pages: 180,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: 'A story of racial injustice and childhood innocence',
    isbn: '9780061120084',
    price: 18.99,
    stock: 8,
    category: 'Fiction',
    publisher: 'J.B. Lippincott & Co.',
    language: 'English',
    pages: 281,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    description: 'A dystopian social science fiction novel',
    isbn: '9780451524935',
    price: 16.99,
    stock: 0,
    category: 'Science Fiction',
    publisher: 'Secker & Warburg',
    language: 'English',
    pages: 328,
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export default function AdminPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const API_BASE_URL = import.meta.env.VITE_PRODUCT_API_URL || 'http://localhost:3001';

  // Validate a token by attempting to call the admin-only products endpoint.
  const validateAdminToken = async (token: string | null): Promise<boolean> => {
    if (!token) return false;
    try {
      const res = await fetch(`${API_BASE_URL}/products/admin/all?limit=1`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  };

  // On mount, validate any stored token rather than blindly writing a demo token.
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('admin_token');
      if (token && token !== 'demo-token') {
        const valid = await validateAdminToken(token);
        if (valid) {
          setIsDemoMode(false);
          setError(null);
          return;
        }
        // Stored token is not valid for admin APIs -> fallback to demo
        localStorage.setItem('admin_token', 'demo-token');
        setIsDemoMode(true);
        setError('Stored token is not authorized for admin API. Please login again.');
        return;
      }
      // No usable token -> use demo
      localStorage.setItem('admin_token', 'demo-token');
      setIsDemoMode(true);
    };
    init();
  }, []);

  // Fetch books from API
  const fetchBooks = async () => {
    
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      
      // First try the admin endpoint
      const response = await fetch(`${API_BASE_URL}/products/admin/all?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data: ApiResponse = await response.json();
        setBooks(data.products);
        setIsDemoMode(false);
        setError(null);
        return;
      }

      // If admin endpoint fails, try public endpoint
      const publicResponse = await fetch(`${API_BASE_URL}/products?limit=100`);

      if (publicResponse.ok) {
        const publicData: ApiResponse = await publicResponse.json();
        setBooks(publicData.products);
        setIsDemoMode(true);
        setError('Using public data - Admin access required for full features');
        return;
      }

      // If both fail, use mock data
      throw new Error('API not available');
      
    } catch (err) {
      console.error('Error fetching books:', err);
      setBooks(mockBooks);
      setIsDemoMode(true);
      setError('Using demo data - API server not available. Changes will not be saved.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_AUTH_API_URL || 'http://localhost:3002'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      // Accept common token property names from different auth services
      const token = data?.access_token || data?.token || data?.accessToken;
      if (!token) {
        throw new Error('Login succeeded but no token was returned');
      }

      // Validate token against admin endpoint before storing it
      const valid = await validateAdminToken(token);
      if (!valid) {
        // Do not store an invalid admin token; keep demo mode instead
        localStorage.setItem('admin_token', 'demo-token');
        setIsDemoMode(true);
        setIsLoginOpen(false);
        setError('Login succeeded but token is not authorized for admin API. Contact API admin.');
        await fetchBooks();
        return;
      }

      // Token is valid for admin API -> store and switch to admin mode
      localStorage.setItem('admin_token', token);
      setIsDemoMode(false);
      setIsLoginOpen(false);
      setError(null);
      await fetchBooks(); // Refresh with admin data
    } catch (err) {
      console.warn('Login attempt failed, falling back to demo behavior:', err);
      // Fallback to demo token so user can continue in demo mode
      localStorage.setItem('admin_token', 'demo-token');
      setIsDemoMode(true);
      setIsLoginOpen(false);
      setError('Login failed - using demo mode');
      await fetchBooks();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.setItem('admin_token', 'demo-token');
    setIsDemoMode(true);
    setBooks(mockBooks);
    setError('Logged out - Using demo mode');
  };

  const filteredBooks = useMemo(
    () =>
      books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.isbn?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [books, searchTerm]
  );

  const handleCreate = async (newBook: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (isDemoMode) {
        // Demo mode: Add to local state
        const demoBook: Book = {
          ...newBook,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setBooks(prev => [demoBook, ...prev]);
        setIsCreateOpen(false);
        setError('Book created in demo mode (not saved to server)');
        return;
      }

      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newBook),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }
        const errorData = await response.json().catch(() => ({ message: 'Failed to create book' }));
        throw new Error(errorData.message || 'Failed to create book');
      }

      await fetchBooks(); // Refresh the list
      setIsCreateOpen(false);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create book';
      setError(errorMessage);
      console.error('Error creating book:', err);
      
      // Fallback to demo mode if auth fails
      if (errorMessage.includes('Authentication failed')) {
        setIsDemoMode(true);
        const demoBook: Book = {
          ...newBook,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setBooks(prev => [demoBook, ...prev]);
        setIsCreateOpen(false);
        setError('Authentication failed. Created book in demo mode.');
      }
    }
  };

  const handleUpdate = async (updatedBook: Omit<Book, "id" | "createdAt" | "updatedAt"> & { id: string }) => {
    try {
      if (isDemoMode) {
        // Demo mode: Update local state
        setBooks(prev => prev.map(book => 
          book.id === updatedBook.id 
            ? { ...updatedBook, updatedAt: new Date().toISOString() } as Book
            : book
        ));
        setIsEditOpen(false);
        setSelectedBook(null);
        setError('Book updated in demo mode (not saved to server)');
        return;
      }

      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/products/${updatedBook.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedBook),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }
        const errorData = await response.json().catch(() => ({ message: 'Failed to update book' }));
        throw new Error(errorData.message || 'Failed to update book');
      }

      await fetchBooks(); // Refresh the list
      setIsEditOpen(false);
      setSelectedBook(null);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update book';
      setError(errorMessage);
      console.error('Error updating book:', err);
      
      // Fallback to demo mode if auth fails
      if (errorMessage.includes('Authentication failed')) {
        setIsDemoMode(true);
        setBooks(prev => prev.map(book => 
          book.id === updatedBook.id 
            ? { ...updatedBook, updatedAt: new Date().toISOString() } as Book
            : book
        ));
        setIsEditOpen(false);
        setSelectedBook(null);
        setError('Authentication failed. Updated book in demo mode.');
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!bookToDelete) return;

    try {
      if (isDemoMode) {
        // Demo mode: Remove from local state
        setBooks(prev => prev.filter(book => book.id !== bookToDelete.id));
        setIsDeleteOpen(false);
        setBookToDelete(null);
        setError('Book deleted in demo mode (not saved to server)');
        return;
      }

      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/products/${bookToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }
        const errorData = await response.json().catch(() => ({ message: 'Failed to delete book' }));
        throw new Error(errorData.message || 'Failed to delete book');
      }

      await fetchBooks(); // Refresh the list
      setIsDeleteOpen(false);
      setBookToDelete(null);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete book';
      setError(errorMessage);
      console.error('Error deleting book:', err);
      
      // Fallback to demo mode if auth fails
      if (errorMessage.includes('Authentication failed')) {
        setIsDemoMode(true);
        setBooks(prev => prev.filter(book => book.id !== bookToDelete.id));
        setIsDeleteOpen(false);
        setBookToDelete(null);
        setError('Authentication failed. Deleted book in demo mode.');
      }
    }
  };

  const stats = [
    {
      label: 'Total Books',
      value: books.length,
      icon: <BookOpen className="w-6 h-6" />,
    },
    {
      label: 'Active Books',
      value: books.filter((b) => b.isActive).length,
      icon: <Zap className="w-6 h-6" />,
    },
    {
      label: 'Total Stock',
      value: books.reduce((sum, b) => sum + b.stock, 0),
      icon: <Package className="w-6 h-6" />,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInRight {
          from { 
            transform: translateX(-100%);
          }
          to { 
            transform: translateX(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.5s ease-out forwards;
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out forwards;
        }
      `}</style>

      {/* Header */}
      <header className="bg-white border-b-2 border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">ShelfNoW Admin</h1>
                <p className="text-xs text-gray-600">Book Management Dashboard</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isDemoMode ? (
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-full text-sm font-medium">
                  Demo Mode
                </span>
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all"
                >
                  <User className="w-4 h-4" />
                  Login
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-green-100 text-green-800 border border-green-300 rounded-full text-sm font-medium">
                  Admin Mode
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
            <span className="text-sm text-gray-600 hidden md:inline">API: {API_BASE_URL}</span>
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-all flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:sticky top-[73px] left-0 w-60 bg-white border-r-2 border-gray-200 h-[calc(100vh-73px)] transition-transform duration-300 z-30 animate-slide-in-right`}
        >
          <nav className="p-4 space-y-2">
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 bg-gray-900 text-white rounded-lg font-medium"
            >
              <Package className="w-5 h-5" />
              Overview
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              Shop
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {/* Error Message */}
          {error && (
            <div className={`mb-6 p-4 border-2 rounded-lg animate-fade-in ${
              error.includes('demo') || error.includes('Demo') 
                ? 'bg-yellow-100 border-yellow-300 text-yellow-800'
                : 'bg-red-100 border-red-300 text-red-700'
            }`}>
              <div className="flex justify-between items-center">
                <span>{error}</span>
                <button 
                  onClick={() => setError(null)}
                  className="font-bold text-lg hover:opacity-70"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white border-2 border-gray-200 p-6 rounded-xl hover:shadow-lg transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-600">{stat.label}</span>
                  <div className="bg-gray-900 text-white p-2.5 rounded-lg">{stat.icon}</div>
                </div>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Books Management Card */}
          <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden animate-fade-in">
            {/* Card Header */}
            <div className="border-b-2 border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Book Inventory</h2>
                  <p className="text-gray-600 mt-1">
                    {isDemoMode 
                      ? 'Demo mode - Changes are temporary' 
                      : 'Manage all books in your catalog'
                    }
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={fetchBooks}
                    className="px-4 py-2.5 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-all font-semibold"
                  >
                    Refresh
                  </button>
                  <button
                    onClick={() => setIsCreateOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-semibold shadow-lg hover:shadow-xl"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Book
                  </button>
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6">
              {/* Search Bar */}
              <div className="mb-6 relative animate-slide-up">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title, author, or ISBN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
                />
              </div>

              {/* Books Table */}
              <div className="overflow-x-auto border-2 border-gray-200 rounded-lg">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Title</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Author</th>
                      <th className="px-4 py-3 text-right text-sm font-bold text-gray-900">Price</th>
                      <th className="px-4 py-3 text-right text-sm font-bold text-gray-900">Stock</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Category</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Status</th>
                      <th className="px-4 py-3 text-right text-sm font-bold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBooks.length > 0 ? (
                      filteredBooks.map((book, idx) => (
                        <tr
                          key={book.id}
                          className="border-b border-gray-200 hover:bg-gray-50 transition-colors animate-slide-up"
                          style={{ animationDelay: `${idx * 50}ms` }}
                        >
                          <td className="px-4 py-4 font-medium text-gray-900 max-w-xs truncate">
                            {book.title}
                          </td>
                          <td className="px-4 py-4 text-gray-700">{book.author}</td>
                          <td className="px-4 py-4 text-right font-semibold text-gray-900">
                            ${book.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                                book.stock > 10
                                  ? 'bg-green-100 text-green-800 border border-green-300'
                                  : book.stock > 0
                                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                                  : 'bg-red-100 text-red-800 border border-red-300'
                              }`}
                            >
                              {book.stock}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-gray-700">{book.category}</td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                                book.isActive
                                  ? 'bg-green-100 text-green-800 border border-green-300'
                                  : 'bg-gray-100 text-gray-800 border border-gray-300'
                              }`}
                            >
                              {book.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setSelectedBook(book);
                                  setIsEditOpen(true);
                                }}
                                className="p-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-all"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4 text-gray-700" />
                              </button>
                              <button
                                onClick={() => {
                                  setBookToDelete(book);
                                  setIsDeleteOpen(true);
                                }}
                                className="p-2 border-2 border-red-300 bg-red-50 rounded-lg hover:bg-red-100 transition-all"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4 text-red-700" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                          No books found. {searchTerm ? 'Try adjusting your search.' : 'Start by adding a new book.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="mt-4 text-sm text-gray-600">
                Showing {filteredBooks.length} of {books.length} books
                {isDemoMode && ' (Demo Mode)'}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border-2 border-gray-200 max-w-md w-full animate-fade-in">
            <div className="border-b-2 border-gray-200 p-6">
              <h3 className="text-2xl font-bold text-gray-900">Admin Login</h3>
              <p className="text-gray-600 mt-1">Enter your credentials to access admin features</p>
            </div>
            <form onSubmit={handleLogin} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="admin@example.com"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition-colors"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-semibold"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setIsLoginOpen(false)}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-all font-semibold"
                >
                  Cancel
                </button>
              </div>
              <div className="text-center text-sm text-gray-600">
                <p>Demo: Use any email and password</p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create/Edit Book Modal */}
      {(isCreateOpen || isEditOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border-2 border-gray-200 max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="border-b-2 border-gray-200 p-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {isCreateOpen ? 'Create New Book' : 'Edit Book'}
              </h3>
              <p className="text-gray-600 mt-1">
                {isCreateOpen ? 'Add a new book to your inventory' : 'Update book information'}
                {isDemoMode && ' (Demo Mode - Changes are temporary)'}
              </p>
            </div>
            <BookForm
              initialData={selectedBook || undefined}
              onSubmit={isCreateOpen ? handleCreate : (data) => {
                if (selectedBook) {
                  handleUpdate({ ...data, id: selectedBook.id });
                }
              }}
              onCancel={() => {
                setIsCreateOpen(false);
                setIsEditOpen(false);
                setSelectedBook(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && bookToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border-2 border-gray-200 max-w-md w-full animate-fade-in">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Delete {bookToDelete.title}?
              </h3>
              <p className="text-gray-600 mb-6">
                {isDemoMode 
                  ? 'This action will remove the book from demo mode (changes are temporary).'
                  : 'This action cannot be undone. The book will be permanently removed from your inventory.'
                }
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setIsDeleteOpen(false);
                    setBookToDelete(null);
                  }}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white border-2 border-red-600 rounded-lg hover:bg-red-700 transition-all font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}