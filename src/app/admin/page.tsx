'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Book {
  _id: string;
  title: string;
  author: string;
  category_id: string;
  category_name: string;
  cover_image?: string;
  availability: boolean;
  description?: string;
  content?: string;
}

interface Category {
  _id: string;
  name: string;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'inventory' | 'categories'>('inventory');

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [selectedCatId, setSelectedCatId] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [availability, setAvailability] = useState(true);
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [formOpen, setFormOpen] = useState(false);

  const [newCatName, setNewCatName] = useState('');

  useEffect(() => {
    const loggedIn = localStorage.getItem('lcu_admin_auth') === 'true';
    if (loggedIn) {
      setIsAuthenticated(true);
      loadDashboardData();
    } else {
      setLoading(false);
    }
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      const bookRes = await fetch('/api/books');
      const bookData = await bookRes.json();
      if (bookData.success) {
        setBooks(bookData.documents);
      }

      const catRes = await fetch('/api/categories');
      const catData = await catRes.json();
      if (catData.success) {
        setCategories(catData.documents);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (username === 'admin' && password === 'lcu2026') {
      setIsAuthenticated(true);
      localStorage.setItem('lcu_admin_auth', 'true');
      setLoginError('');
      loadDashboardData();
    } else {
      setLoginError('Invalid Administrator Credentials. Access Denied.');
    }
  }

  function handleLogout() {
    setIsAuthenticated(false);
    localStorage.removeItem('lcu_admin_auth');
    setUsername('');
    setPassword('');
  }

  function openAddForm() {
    setIsEditing(false);
    setEditingId('');
    setTitle('');
    setAuthor('');
    setSelectedCatId(categories[0]?._id || '');
    setCoverImage('');
    setAvailability(true);
    setDescription('');
    setContent('');
    setFormOpen(true);
  }

  function openEditForm(book: Book) {
    setIsEditing(true);
    setEditingId(book._id);
    setTitle(book.title);
    setAuthor(book.author);
    setSelectedCatId(book.category_id);
    setCoverImage(book.cover_image || '');
    setAvailability(book.availability);
    setDescription(book.description || '');
    setContent(book.content || '');
    setFormOpen(true);
  }

  async function handleBookSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cat = categories.find((c) => c._id === selectedCatId);
    if (!cat) return;

    const payload = {
      title,
      author,
      category_id: selectedCatId,
      category_name: cat.name,
      cover_image: coverImage || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
      availability,
      description,
      content
    };

    try {
      let res;
      if (isEditing) {
        res = await fetch(`/api/books/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/books', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (data.success) {
        setFormOpen(false);
        loadDashboardData();
      }
    } catch (err) {
      console.error('Failed to submit book:', err);
    }
  }

  async function handleDeleteBook(id: string) {
    if (!confirm('Are you sure you want to delete this volume from catalogue archives?')) return;
    try {
      const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        loadDashboardData();
      }
    } catch (err) {
      console.error('Failed to delete book:', err);
    }
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatName })
      });
      const data = await res.json();
      if (data.success) {
        setNewCatName('');
        loadDashboardData();
      }
    } catch (err) {
      console.error('Failed to add category:', err);
    }
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm('Deleting this category will remove it from academic departments. Proceed?')) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        loadDashboardData();
      }
    } catch (err) {
      console.error('Failed to delete category:', err);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 bg-slate-50 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-xl w-full max-w-md bg-[radial-gradient(#faf8f5_1px,transparent_1px)] [background-size:24px_24px] relative"
        >
          <div className="absolute inset-3 border border-slate-100 pointer-events-none rounded-xl"></div>
          <div className="absolute inset-4 border border-pink-500/10 pointer-events-none rounded-xl"></div>

          <div className="text-center mb-8 relative z-10">
            <span className="font-serif text-2xl font-bold tracking-tight text-slate-900 block">
              LCU REGISTRY
            </span>
            <span className="text-[10px] font-bold text-pink-600 uppercase tracking-widest -mt-1 pl-0.5 block">
              • Catalog Administrator Gate •
            </span>
            <div className="w-12 h-[1px] bg-pink-500/30 mx-auto mt-4"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Registry User Key</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin"
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-900 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Access PIN Code</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-900 text-sm font-semibold"
              />
            </div>

            {loginError && (
              <p className="text-rose-700 text-xs font-bold bg-rose-50 border border-rose-100 p-3.5 rounded">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-blue-950 text-pink-100 font-bold rounded-lg border border-pink-500/20 hover:bg-pink-650 hover:text-white transition-all duration-300 cursor-pointer shadow-md text-xs uppercase tracking-widest"
            >
              Verify Registry Access
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const totalBooks = books.length;
  const availableBooks = books.filter((b) => b.availability).length;
  const outOfStock = totalBooks - availableBooks;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6 mb-10">
        <div>
          <h1 className="font-serif text-3xl font-bold text-blue-950 leading-tight">University Archival Console</h1>
          <p className="text-xs uppercase font-bold tracking-widest text-pink-600 mt-1">Lead City Bookstore Inventory Database</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-5 py-2.5 bg-white text-slate-650 border border-slate-200 text-xs font-bold uppercase tracking-wider rounded hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition duration-300 cursor-pointer shadow-sm"
        >
          Disconnect Registry Session
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 w-full bg-blue-900"></div>
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest block mb-1">Archived Volumes</span>
          <span className="text-3xl font-bold text-blue-950 font-serif">{loading ? '...' : totalBooks} Titles</span>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 w-full bg-emerald-600"></div>
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest block mb-1">Shelved In-Stock</span>
          <span className="text-3xl font-bold text-emerald-700 font-serif">{loading ? '...' : availableBooks} Available</span>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 w-full bg-rose-600"></div>
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest block mb-1">Loaned / Out of Stock</span>
          <span className="text-3xl font-bold text-rose-700 font-serif">{loading ? '...' : outOfStock} Titles</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-8 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-6 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              activeTab === 'inventory' ? 'bg-blue-950 text-pink-100 border border-pink-500/20 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            Inventory Records
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              activeTab === 'categories' ? 'bg-blue-950 text-pink-100 border border-pink-500/20 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            Academic Departments
          </button>
        </div>

        {activeTab === 'inventory' && (
          <button
            onClick={openAddForm}
            className="px-6 py-3 bg-blue-950 text-pink-100 rounded text-xs font-bold uppercase tracking-widest border border-pink-500/20 hover:bg-pink-600 hover:text-white transition-all duration-300 cursor-pointer text-center"
          >
            + Register Scholarly Volume
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-pink-500 border-t-transparent mx-auto mb-4"></div>
          <p className="font-serif italic text-sm">Querying database stacks...</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {activeTab === 'inventory' ? (
            <motion.div
              key="inventory"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden bg-[radial-gradient(#faf8f5_1px,transparent_1px)] [background-size:24px_24px]"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                      <th className="py-4 px-6">Hardcover</th>
                      <th className="py-4 px-6">Book Title</th>
                      <th className="py-4 px-6">Author</th>
                      <th className="py-4 px-6">Academic Area</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Registry Operation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-750">
                    {books.map((book) => (
                      <tr key={book._id} className="hover:bg-slate-50/40 transition">
                        <td className="py-4 px-6">
                          <img
                            src={book.cover_image}
                            alt={book.title}
                            className="w-12 h-16 object-cover rounded border border-slate-200 shadow-sm"
                          />
                        </td>
                        <td className="py-4 px-6 max-w-xs truncate font-serif font-bold text-blue-950">{book.title}</td>
                        <td className="py-4 px-6 text-xs text-slate-500 italic">by {book.author}</td>
                        <td className="py-4 px-6">
                          <span className="text-[10px] bg-blue-50 text-blue-900 border border-blue-100 px-3 py-1 rounded font-bold uppercase tracking-widest">
                            {book.category_name}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            book.availability
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}>
                            {book.availability ? 'In Stock' : 'Loaned'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => openEditForm(book)}
                            className="px-3 py-1.5 bg-slate-50 text-slate-650 border border-slate-200 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-blue-950 hover:text-pink-100 hover:border-pink-500/20 transition cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBook(book._id)}
                            className="px-3 py-1.5 bg-slate-50 text-rose-700 border border-rose-100 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-rose-950 hover:text-rose-300 hover:border-rose-500/20 transition cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {books.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-16 text-slate-400 font-serif italic text-base">
                          No archival textbooks registered inside this system database.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-8"
            >
              {/* Add Category Card */}
              <div className="md:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-md h-fit">
                <h3 className="font-serif font-bold text-lg text-slate-900 mb-4 border-b border-slate-100 pb-2">Academic Department</h3>
                <form onSubmit={handleAddCategory} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Department Name</label>
                    <input
                      type="text"
                      required
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="e.g. Mathematics"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-900 text-sm font-semibold"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-blue-950 text-pink-100 border border-pink-500/20 font-bold rounded-lg hover:bg-pink-650 hover:text-white transition duration-300 cursor-pointer shadow-sm text-xs uppercase tracking-widest"
                  >
                    Add Academic department
                  </button>
                </form>
              </div>

              {/* Category table listing */}
              <div className="md:col-span-8 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden bg-[radial-gradient(#faf8f5_1px,transparent_1px)] [background-size:24px_24px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                      <th className="py-4 px-6">Department Name</th>
                      <th className="py-4 px-6 text-right">Registry Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                    {categories.map((cat) => (
                      <tr key={cat._id} className="hover:bg-slate-50/40 transition">
                        <td className="py-4 px-6 text-blue-950 font-serif font-bold">{cat.name}</td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleDeleteCategory(cat._id)}
                            className="px-3.5 py-1.5 bg-slate-50 text-rose-700 border border-rose-100 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-rose-950 hover:text-rose-300 hover:border-rose-500/20 transition cursor-pointer"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                    {categories.length === 0 && (
                      <tr>
                        <td colSpan={2} className="text-center py-16 text-slate-400 font-serif italic text-base">
                          No registered departments active inside this system registry.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Book Form Overlay Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[radial-gradient(#faf8f5_1px,transparent_1px)] [background-size:24px_24px] relative"
          >
            <div className="absolute inset-4 border border-slate-100 pointer-events-none rounded-xl"></div>
            <div className="absolute inset-5 border border-pink-500/5 pointer-events-none rounded-xl"></div>

            <div className="flex justify-between items-center mb-6 relative z-10 border-b border-slate-100 pb-3">
              <h2 className="font-serif text-2xl font-bold text-slate-900">
                {isEditing ? 'Modify Catalogue Record' : 'Register New Scholarly Text'}
              </h2>
              <button
                onClick={() => setFormOpen(false)}
                className="text-slate-400 hover:text-slate-650 transition text-2xl font-semibold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="space-y-5 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Book Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Introduction to Algorithms"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-950 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Author</label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Thomas H. Cormen"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-950 text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Academic Area Department</label>
                  <select
                    required
                    value={selectedCatId}
                    onChange={(e) => setSelectedCatId(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-950 text-sm font-semibold"
                  >
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Cover Image URL</label>
                  <input
                    type="url"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-950 text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Stack Availability Status</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs uppercase text-slate-650 tracking-wider">
                    <input
                      type="radio"
                      checked={availability === true}
                      onChange={() => setAvailability(true)}
                      className="accent-blue-950"
                    />
                    Shelved In Stock
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs uppercase text-slate-650 tracking-wider">
                    <input
                      type="radio"
                      checked={availability === false}
                      onChange={() => setAvailability(false)}
                      className="accent-blue-950"
                    />
                    Loaned / Out of Stock
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Scholarly Abstract Summary</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide an overview of the volume..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-950 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Full Book Content (Online Reading Text)</label>
                <textarea
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste the full book content here..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-950 text-sm font-semibold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-5 py-2.5 bg-slate-150 text-slate-600 text-xs font-bold uppercase tracking-wider rounded hover:bg-slate-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-950 text-pink-100 border border-pink-500/20 text-xs font-bold uppercase tracking-widest hover:bg-pink-600 hover:text-white shadow transition cursor-pointer"
                >
                  {isEditing ? 'Save Archival Changes' : 'Publish Scholarly Volume'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
