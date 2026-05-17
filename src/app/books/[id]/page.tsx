'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Book {
  _id: string;
  title: string;
  author: string;
  category_id: string;
  category_name: string;
  cover_image?: string;
  availability: boolean;
  description?: string;
}

export default function BookDetails() {
  const params = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadBook() {
      if (!params.id) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/books/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setBook(data.document);
        } else {
          setError(data.error || 'Book not found');
        }
      } catch (err) {
        console.error('Failed to load book:', err);
        setError('Connection error. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    loadBook();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-500 bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-pink-500 border-t-transparent mb-4"></div>
        <p className="font-serif italic text-base">Retrieving catalog record from archive shelves...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-700 bg-slate-50 px-4">
        <svg className="w-12 h-12 text-pink-650 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
        <h2 className="text-2xl font-bold text-blue-950 font-serif mb-2">Record Not Located</h2>
        <p className="text-slate-500 text-sm mb-6 max-w-sm text-center">{error || 'This specific volume identification does not map to any active archives.'}</p>
        <Link href="/" className="px-6 py-3 bg-blue-950 text-pink-100 font-bold rounded-lg border border-pink-500/20 hover:bg-pink-600 hover:text-white transition duration-300">
          Return to Registry Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Dynamic Classical Back Button */}
      <Link href="/" className="inline-flex items-center gap-2 text-slate-600 font-bold uppercase tracking-wider text-xs hover:text-pink-600 transition duration-300 mb-10 group">
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="group-hover:-translate-x-1.5 transition-all duration-300">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Return to Catalog Index
      </Link>

      {/* Premium Classical Catalog card Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-xl overflow-hidden relative bg-[radial-gradient(#faf8f5_1px,transparent_1px)] [background-size:24px_24px]">
        
        {/* Subtle decorative crest corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] pointer-events-none select-none border-b-2 border-l-2 border-blue-950 rounded-bl-full bg-blue-950"></div>

        {/* Animated classical Book cover image frame */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:col-span-5 rounded-xl overflow-hidden shadow-lg border border-slate-250 p-2 bg-slate-50 max-h-[520px] flex items-center justify-center"
        >
          <img
            src={book.cover_image}
            alt={book.title}
            className="w-full h-full object-cover rounded-lg border border-slate-100"
          />
        </motion.div>

        {/* Animated descriptive card details */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:col-span-7 flex flex-col justify-center"
        >
          {/* Availability and record type banners */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] font-bold bg-pink-500/5 text-pink-600 border border-pink-500/20 px-3 py-1 rounded tracking-widest uppercase">
              Catalogue Volume Record
            </span>
            <span className={`px-3.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${
              book.availability
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-sm'
                : 'bg-rose-50 text-rose-800 border-rose-200 shadow-sm'
            }`}>
              {book.availability ? '● Active Stack Shelf' : '○ Borrowed / Out of Stock'}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-blue-950 leading-tight mb-4 border-b border-slate-100 pb-4">
            {book.title}
          </h1>
          
          <p className="text-slate-500 text-lg sm:text-xl font-medium mb-8">
            by <span className="text-blue-950 font-serif italic font-bold">{book.author}</span>
          </p>

          {/* Scholars Abstract Panel */}
          <div className="bg-[#fcfbf9] p-6 rounded-xl border border-slate-200 mb-8 relative">
            <div className="absolute top-3 right-4 font-serif text-xs italic text-slate-350 select-none">Abstract Index</div>
            <h3 className="font-serif text-blue-950 font-bold text-base mb-3 border-b border-slate-200 pb-2">Academic Overview</h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line font-medium">
              {book.description || 'No digital abstract summary is currently archived for this publication. Please visit the physical library desk inside Lead City University to consult the indices.'}
            </p>
          </div>

          {/* Fine Academic Reference details */}
          <div className="border-t border-slate-100 pt-6 grid grid-cols-2 gap-6 text-xs">
            <div>
              <span className="text-slate-400 font-semibold block mb-1">Academic Area Department</span>
              <span className="font-bold text-blue-950 uppercase tracking-widest text-[10px] bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full w-fit">
                {book.category_name}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block mb-1">Catalogue Shelf UID</span>
              <span className="font-mono text-xs font-semibold text-slate-600 tracking-wider select-all">{book._id}</span>
            </div>
          </div>

          {/* Sophisticated Action Button */}
          <button
            onClick={() => alert('This is a scholar prototype demonstration. Please visit the Lead City University physical bookstore to borrow or purchase this volume.')}
            className="mt-10 px-8 py-4 bg-blue-950 text-pink-100 font-bold text-xs uppercase tracking-widest rounded-lg border border-pink-500/20 hover:bg-pink-600 hover:text-white hover:border-pink-600 hover:shadow-lg transition-all duration-300 w-full sm:w-fit cursor-pointer text-center"
          >
            Locate Book Shelf Location
          </button>
        </motion.div>
      </div>
    </div>
  );
}
