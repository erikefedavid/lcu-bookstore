import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import HeaderLogo from '@/components/HeaderLogo';

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LCU Online Bookstore | Lead City University Ibadan",
  description: "Sophisticated digital repository for textbooks and scholarly resources at Lead City University.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-pink-100 selection:text-blue-900">
        
        {/* LCU Top Accent Ribbon (Blue, Pink, White) */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-800 via-pink-500 to-blue-950"></div>

        {/* Sophisticated Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/95">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              {/* Client-safe Dynamic Logo Resolver */}
              <HeaderLogo />
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-blue-950 group-hover:text-pink-600 transition duration-300">
                  LEAD CITY UNIVERSITY
                </span>
                <span className="text-[9px] font-bold text-pink-600 uppercase tracking-widest -mt-1 pl-0.5">
                  • Library & Bookstore Archives •
                </span>
              </div>
            </Link>
            <nav className="flex items-center gap-6 font-semibold text-sm tracking-wide text-slate-600">
              <Link href="/" className="hover:text-pink-600 transition duration-200">Home</Link>
              <Link href="/#catalogue" className="hover:text-pink-600 transition duration-200">Catalog</Link>
            </nav>
          </div>
        </header>

        {/* Dynamic scholar content */}
        <main className="flex-grow">{children}</main>

        {/* Classical Academic Footer */}
        <footer className="bg-slate-950 text-slate-200 py-16 border-t-2 border-pink-500/30 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#db2777_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="w-16 h-1 bg-pink-500 mx-auto mb-8 rounded-full"></div>
            <p className="font-serif text-xl font-bold tracking-wider text-white">LEAD CITY UNIVERSITY ONLINE BOOKSTORE</p>
            <p className="text-pink-500 text-xs font-bold uppercase tracking-widest mt-1">Department of Computer Science — Software Engineering</p>
            
            <div className="max-w-md mx-auto my-6 p-5 border border-slate-800 bg-slate-900/60 rounded-xl">
              <p className="text-slate-400 text-xs leading-relaxed">
                A final year thesis project presented in partial fulfillment of the requirements for the award of Bachelor of Science (BSc) degree in Software Engineering.
              </p>
              <p className="text-pink-400 text-xs font-bold mt-2">
                Candidate: Adeniyan Adebomi Elizabeth · LCU/UG/22/21918
              </p>
              <p className="text-slate-400 text-xs mt-1">
                Supervisor: Dr. Akolade
              </p>
            </div>
            
            {/* Elegant and subtle Admin Gate link in footer */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between border-t border-slate-900 pt-8 text-slate-500 text-xs gap-4">
              <p className="tracking-widest uppercase">&copy; {new Date().getFullYear()} Lead City University. All academic rights reserved.</p>
              <Link href="/admin" className="hover:text-pink-500 transition duration-200 uppercase tracking-widest text-[9px] font-bold border border-slate-800 hover:border-pink-500/20 px-3 py-1.5 rounded bg-slate-900/40">
                Registry Administration Gate
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
