'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import HeaderLogo from './HeaderLogo';
import LogoutButton from './LogoutButton';

interface SerializedUser {
  name: string;
  role: string;
}

interface HeaderProps {
  user: SerializedUser | null;
}

export default function Header({ user }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group" onClick={closeMenu}>
          <HeaderLogo />
          <div className="flex flex-col">
            <span className="font-serif text-base sm:text-2xl font-bold tracking-tight text-blue-950 group-hover:text-pink-600 transition duration-300 whitespace-nowrap">
              LEAD CITY UNIVERSITY
            </span>
            <span className="text-[7.5px] sm:text-[9px] font-bold text-pink-600 uppercase tracking-widest -mt-1 pl-0.5">
              • Library & Bookstore Archives •
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 font-semibold text-sm tracking-wide text-slate-600">
          <Link href="/" className="hover:text-pink-600 transition duration-200">Home</Link>
          <Link href="/#catalogue" className="hover:text-pink-600 transition duration-200">Catalog</Link>
          
          {user ? (
            <div className="flex items-center gap-4 border-l border-slate-200 pl-4">
              <span className="text-xs text-blue-950 font-serif italic font-bold">
                Hi, {user.name.split(' ')[0]} ({user.role})
              </span>
              <LogoutButton />
            </div>
          ) : (
            <div className="flex items-center gap-4 border-l border-slate-200 pl-4">
              <Link href="/login" className="hover:text-pink-600 transition duration-200 text-xs uppercase tracking-wider font-bold">
                Log In
              </Link>
              <Link href="/register" className="bg-blue-950 text-pink-100 border border-pink-500/20 px-4 py-1.5 rounded-lg hover:bg-pink-600 hover:text-white transition duration-200 text-xs uppercase tracking-wider font-bold">
                Register
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden">
          <button
            onClick={toggleMenu}
            className="text-slate-600 hover:text-pink-600 p-2 focus:outline-none transition-colors duration-200 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden border-t border-slate-100 bg-white overflow-hidden shadow-inner"
          >
            <div className="px-4 py-6 space-y-4 flex flex-col font-semibold text-sm text-slate-600">
              <Link
                href="/"
                className="hover:text-pink-600 hover:bg-slate-50 px-3 py-2.5 rounded-lg transition duration-200 block"
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link
                href="/#catalogue"
                className="hover:text-pink-600 hover:bg-slate-50 px-3 py-2.5 rounded-lg transition duration-200 block"
                onClick={closeMenu}
              >
                Catalog
              </Link>
              
              <div className="border-t border-slate-100 pt-4 mt-2">
                {user ? (
                  <div className="flex flex-col gap-4 px-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Logged In Student</span>
                      <span className="text-sm text-blue-950 font-serif italic font-bold">
                        Hi, {user.name} ({user.role})
                      </span>
                    </div>
                    <div className="pt-2" onClick={closeMenu}>
                      <LogoutButton />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 px-3">
                    <Link
                      href="/login"
                      className="hover:text-pink-600 py-2.5 transition duration-200 text-xs uppercase tracking-wider font-bold block"
                      onClick={closeMenu}
                    >
                      Log In
                    </Link>
                    <Link
                      href="/register"
                      className="bg-blue-950 text-pink-100 border border-pink-500/20 px-4 py-3 rounded-lg hover:bg-pink-600 hover:text-white transition duration-200 text-xs uppercase tracking-wider font-bold text-center block"
                      onClick={closeMenu}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
