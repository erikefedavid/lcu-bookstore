'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Book {
  _id: string;
  title: string;
  author: string;
  category_id: string;
  category_name: string;
  cover_image?: string;
  availability: boolean;
}

interface Category {
  _id: string;
  name: string;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const catRes = await fetch('/api/categories');
        const catData = await catRes.json();
        if (catData.success) {
          setCategories(catData.documents);
        }

        const bookRes = await fetch('/api/books');
        const bookData = await bookRes.json();
        if (bookData.success) {
          setBooks(bookData.documents);
        }
      } catch (err) {
        console.error('Failed to load books and categories:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory ? book.category_id === selectedCategory : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Sophisticated LCU Blue, Pink, & White Hero Section */}
      <section className="bg-gradient-to-br from-[#0c1428] via-[#111c38] to-[#1e102a] text-white py-24 relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(#ec4899_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Scholarly Search Platform */}
            <div className="lg:col-span-7 text-left">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-pink-500/20 bg-pink-500/5 text-pink-400 text-xs font-bold uppercase tracking-widest mb-6"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse"></span>
                Lead City Academic Repository
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.8 }}
                className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight text-white"
              >
                LCU Scholarly Archives & Catalogue
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-slate-300 font-serif italic text-base sm:text-lg mb-10 leading-relaxed max-w-2xl"
              >
                "Knowledge is the supreme beacon." Search undergraduate textbook inventory registers, departmental indices, and course references instantly.
              </motion.p>

              {/* Classical Academic Search Console */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="max-w-xl"
              >
                <div className="relative p-1 bg-white/5 backdrop-blur-md rounded-2xl border border-slate-700/60 shadow-xl">
                  <input
                    type="text"
                    placeholder="Search titles, authors, or departments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-6 pr-12 py-4 bg-slate-950/90 text-white rounded-xl shadow-inner border border-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium placeholder-slate-500"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-pink-500">
                    <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Beautiful Book Stack Landing Cover Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.9 }}
              className="lg:col-span-5 flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-[380px] aspect-[4/5] rounded-2xl overflow-hidden border-2 border-pink-500/20 shadow-2xl bg-slate-900 group">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 opacity-60"></div>
                <img
                  src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800"
                  alt="Scholarly Textbook Volume"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest mb-1">Featured volume</p>
                  <h4 className="font-serif text-lg font-bold text-white mb-1">Academic Research Guide</h4>
                  <p className="text-xs text-slate-300 italic">Lead City University Press</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Catalog Grid Section */}
      <main id="catalogue" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-mt-20">
        
        {/* Classical Index Pill Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-16">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer border ${
              selectedCategory === ''
                ? 'bg-blue-950 text-pink-100 border-pink-500/40 shadow-md scale-[1.02]'
                : 'bg-white border-slate-200 text-slate-600 hover:text-blue-950 hover:bg-slate-50'
            }`}
          >
            All Archives
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => setSelectedCategory(category._id)}
              className={`px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer border ${
                selectedCategory === category._id
                  ? 'bg-blue-950 text-pink-100 border-pink-500/40 shadow-md scale-[1.02]'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-blue-950 hover:bg-slate-50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Dynamic Catalog Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-500">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-pink-500 border-t-transparent mb-4"></div>
            <p className="font-serif italic text-base">Retrieving Lead City Archival inventory...</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            >
              {filteredBooks.map((book, idx) => (
                <motion.div
                  layout
                  key={book._id}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: idx * 0.04 }}
                  className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-pink-500/20 hover:scale-[1.01] transition-all duration-300 group flex flex-col h-full bg-[radial-gradient(#faf8f5_1px,transparent_1px)] [background-size:24px_24px]"
                >
                  {/* Premium book cover container */}
                  <Link href={`/books/${book._id}`} className="relative h-80 overflow-hidden bg-slate-100 block border-b border-slate-100">
                    <img
                      src={book.cover_image}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-all duration-700"
                    />
                    
                    {/* Clear contrast availability ribbon */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-md border ${
                        book.availability
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}>
                        {book.availability ? '● In Stock' : '○ Loaned Out'}
                      </span>
                    </div>
                  </Link>
                  
                  {/* Catalog Details Block */}
                  <div className="p-6 flex flex-col flex-grow">
                    <span className="text-[10px] font-bold text-pink-600 uppercase tracking-widest mb-2 block">{book.category_name}</span>
                    <h3 className="font-serif text-lg font-bold text-blue-950 leading-snug mb-1 group-hover:text-pink-600 transition duration-300 line-clamp-2">
                      <Link href={`/books/${book._id}`}>{book.title}</Link>
                    </h3>
                    <p className="text-slate-500 text-sm italic mb-5">by {book.author}</p>
                    
                    {/* Scholarly Link Action button */}
                    <div className="mt-auto pt-4 border-t border-slate-100">
                      <Link
                        href={`/books/${book._id}`}
                        className="w-full py-3 bg-slate-50 text-blue-950 border border-slate-200 rounded text-center text-xs font-bold uppercase tracking-wider hover:bg-blue-950 hover:text-pink-150 hover:border-pink-500/20 transition-all duration-300 block"
                      >
                        Examine Reference
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {!loading && filteredBooks.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-md mx-auto">
            <svg className="w-12 h-12 text-slate-350 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            <h3 className="text-slate-800 font-serif text-xl font-bold mb-1">Archive Entry Empty</h3>
            <p className="text-slate-400 text-xs px-6">We could not locate any volumes corresponding to "{searchQuery}" inside the database archive.</p>
          </div>
        )}
      </main>
    </div>
  );
}
