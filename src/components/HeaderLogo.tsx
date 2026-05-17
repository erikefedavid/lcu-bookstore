'use client';

import { useState } from 'react';

export default function HeaderLogo() {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="relative w-12 h-12 flex items-center justify-center bg-blue-50 rounded-full border border-blue-100 p-1 group-hover:scale-105 transition-transform duration-300">
      {imgFailed ? (
        // Elegant scholarly SVG seal fallback if logo file isn't uploaded yet
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          className="w-7 h-7 text-pink-600 animate-fade-in"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
          />
        </svg>
      ) : (
        <img 
          src="/lcu-logo.png" 
          alt="LCU" 
          onError={() => setImgFailed(true)}
          className="w-full h-full object-contain"
        />
      )}
    </div>
  );
}
