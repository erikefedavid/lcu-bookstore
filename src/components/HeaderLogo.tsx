'use client';

export default function HeaderLogo() {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center bg-white rounded-full border border-slate-200 p-0.5 group-hover:scale-105 transition-transform duration-300 overflow-hidden shadow-sm">
      <img 
        src="/lcu-logo.png" 
        alt="Lead City University Logo" 
        className="w-full h-full object-cover"
      />
    </div>
  );
}
