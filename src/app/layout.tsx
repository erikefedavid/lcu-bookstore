import type { Metadata } from "next";
import "./globals.css";
import Link from 'next/link';
import Header from '@/components/Header';

const inter = { variable: "font-sans" };
const playfair = { variable: "font-serif" };

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';
import User from '@/models/User';


const JWT_SECRET = process.env.JWT_SECRET || 'lcu-super-secret-jwt-key-2026';

export const metadata: Metadata = {
  title: "LCU Online Bookstore | Lead City University Ibadan",
  description: "Sophisticated digital repository for textbooks and scholarly resources at Lead City University.",
};

async function getAuthenticatedUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('lcu_token')?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    await connectDB();
    const user = await User.findById(decoded.id).select('name role');
    return user;
  } catch (error) {
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getAuthenticatedUser();
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-pink-100 selection:text-blue-900">
        
        {/* LCU Top Accent Ribbon (Blue, Pink, White) */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-800 via-pink-500 to-blue-950"></div>

        {/* Sophisticated Responsive Header */}
        <Header user={user ? { name: user.name, role: user.role } : null} />

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
