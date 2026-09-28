import React from 'react';
import { Logo } from './Logo';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface NotFoundProps {
  onBackToHome?: () => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ onBackToHome }) => {
  const handleHome = () => {
    if (onBackToHome) {
      onBackToHome();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden">
      {/* Top Bar with Logo & Theme Toggle */}
      <header className="flex items-center justify-between max-w-6xl w-full mx-auto">
        <a href="/" onClick={(e) => { e.preventDefault(); handleHome(); }}>
          <Logo size="md" />
        </a>
        <ThemeToggle size="md" />
      </header>

      {/* Main 404 Hero */}
      <main className="max-w-2xl mx-auto text-center py-16 sm:py-24 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/25">
          <Search className="w-3.5 h-3.5" />
          <span>Error 404 &middot; Page Not Found</span>
        </div>

        <h1 className="text-7xl sm:text-9xl font-black tracking-tight bg-gradient-to-r from-[#1769FF] via-cyan-400 to-indigo-500 bg-clip-text text-transparent font-['Outfit']">
          404
        </h1>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
          Page Not Found
        </h2>

        <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
          The page or digital solution you are searching for might have been moved, renamed, or is temporarily unavailable. Let us guide you back.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={handleHome}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#1769FF] to-[#0052CC] hover:brightness-110 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold border border-slate-700 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} Digital X Multi Services Pvt. Ltd. All rights reserved.
      </footer>
    </div>
  );
};

export default NotFound;
