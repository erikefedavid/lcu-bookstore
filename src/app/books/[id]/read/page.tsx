'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Book {
  _id: string;
  title: string;
  author: string;
  content?: string;
}

export default function BookReader() {
  const params = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadBook() {
      if (!params.id) return;
      try {
        setLoading(true);
        
        // 1. First, check if the student is authenticated
        const authRes = await fetch('/api/auth/me');
        const authData = await authRes.json();
        
        if (!authData.success) {
          // If not logged in, redirect to login page
          window.location.href = `/login?redirect=/books/${params.id}/read`;
          return;
        }

        // 2. Load the book details and content
        const res = await fetch(`/api/books/${params.id}`);
        const data = await res.json();
        if (data.success) {
          if (!data.document.availability) {
            setError('This volume is currently not available for reading.');
          } else {
            setBook(data.document);
          }
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
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-500 bg-[#fdfcfaf8]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-300 border-t-slate-800 mb-4"></div>
        <p className="font-serif italic text-base">Opening volume...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-700 bg-slate-50 px-4">
        <h2 className="text-2xl font-bold text-blue-950 font-serif mb-2">Volume Unavailable</h2>
        <p className="text-slate-500 text-sm mb-6 max-w-sm text-center">{error || 'Could not load the reading content.'}</p>
        <Link href={`/books/${params.id}`} className="px-6 py-3 bg-blue-950 text-white rounded hover:bg-blue-900 transition">
          Return to Details
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfcfaf8] text-slate-900 font-serif selection:bg-blue-100 selection:text-blue-900">
      
      {/* Reader Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-[#fdfcfaf8]/90 backdrop-blur-sm border-b border-slate-200/60 px-4 sm:px-8 py-3 flex items-center justify-between">
        <Link href={`/books/${book._id}`} className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-950 transition-colors text-xs uppercase tracking-widest font-sans font-bold">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Close Reader
        </Link>
        <div className="text-xs uppercase tracking-widest font-sans font-bold text-slate-400 truncate max-w-xs sm:max-w-md text-right">
          {book.title}
        </div>
      </div>

      {/* Reader Content Area */}
      <div className="max-w-3xl mx-auto px-6 sm:px-12 py-16 sm:py-24">
        
        {/* Title Header */}
        <header className="mb-16 text-center border-b border-slate-200 pb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-6">
            {book.title}
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 italic">
            by <span className="font-semibold">{book.author}</span>
          </p>
        </header>

        {/* Text Content */}
        <article className="prose prose-slate prose-lg sm:prose-xl max-w-none text-slate-800 leading-relaxed font-serif">
          {book.content ? (
            <div className="whitespace-pre-line">
              {book.content}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400 italic border-2 border-dashed border-slate-200 rounded-xl">
              <svg className="w-12 h-12 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
              <p className="text-xl mb-2">No online text available.</p>
              <p className="text-base text-slate-400">The digital contents for this volume have not been uploaded by the registry administration yet.</p>
            </div>
          )}
        </article>

        {/* End Marker */}
        {book.content && (
          <div className="mt-20 flex justify-center">
            <div className="w-16 h-1 bg-slate-200 rounded-full"></div>
          </div>
        )}

      </div>
    </div>
  );
}
