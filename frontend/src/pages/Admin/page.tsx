/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useMemo, useEffect } from 'react';
import { BookOpen, Plus, Edit2, Trash2, Search, Package, Zap, Menu, X, Home, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService, type Product, type CreateProductRequest } from '../../services/api';
import BookForm from '@/components/admin/book-form';

interface ApiResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function AdminDashboard() {
  const [books, setBooks] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState<Product | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Product | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user, isAdmin, logout } = useAuth();

  console.log('AdminDashboard: Current user:', user);

  // Fetch books from API
  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!isAdmin) {
        setError('Admin access required');
        setLoading(false);
        return;
      }

      const response = await apiService.getAllProductsAdmin();
      setBooks(response.products);
      
    } catch (err: any) {
      console.error('Error fetching books:', err);
      setError(err.message || 'Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchBooks();
    }
  }, [isAdmin]);

  const handleCreate = async (newBook: CreateProductRequest) => {
    try {
      setError(null);
      await apiService.createProduct(newBook);
      await fetchBooks(); // Refresh the list
      setIsCreateOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create book');
      console.error('Error creating book:', err);
    }
  };

  const handleUpdate = async (updatedBook: CreateProductRequest & { id: string }) => {
    try {
      setError(null);
      await apiService.updateProduct(updatedBook.id, updatedBook);
      await fetchBooks(); // Refresh the list
      setIsEditOpen(false);
      setSelectedBook(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update book');
      console.error('Error updating book:', err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!bookToDelete) return;

    try {
      setError(null);
      await apiService.deleteProduct(bookToDelete.id);
      await fetchBooks(); // Refresh the list
      setIsDeleteOpen(false);
      setBookToDelete(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete book');
      console.error('Error deleting book:', err);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const filteredBooks = useMemo(
    () =>
      books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [books, searchTerm]
  );

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

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Access Denied</p>
            <p>You need admin privileges to access this page.</p>
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

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
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-green-100 text-green-800 border border-green-300 rounded-full text-sm font-medium">
                Admin Mode
              </span>
              <span className="text-gray-700">
                Welcome, {user?.firstName} {user?.lastName}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
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
                  <p className="text-gray-600 mt-1">Manage all books in your catalog</p>
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
              </div>
            </div>
          </div>
        </main>
      </div>

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
              </p>
            </div>
            <BookForm
              initialData={selectedBook || undefined}
              onSubmit={
                isCreateOpen
                  ? (data: CreateProductRequest) => { void handleCreate(data); }
                  : (data: CreateProductRequest) => {
                      if (selectedBook) {
                        void handleUpdate({ ...data, id: selectedBook.id });
                      }
                    }
              }
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
                This action cannot be undone. The book will be permanently removed from your inventory.
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