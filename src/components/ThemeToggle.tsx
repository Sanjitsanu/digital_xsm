import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = false,
  size = 'md',
}) => {
  const { theme, isDark, toggleTheme } = useTheme();

  const isSmall = size === 'sm';
  const labelText = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={labelText}
      title={labelText}
      className={`relative inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-300 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769FF] active:scale-95 ${
        isDark
          ? 'bg-slate-800/80 hover:bg-slate-700/80 text-amber-300 border border-slate-700/80 hover:border-amber-400/40 shadow-sm'
          : 'bg-[#141414] hover:bg-[#1E1E1E] text-amber-300 border border-[#2B2B2B] hover:border-amber-400/40 shadow-sm'
      } ${
        isSmall ? 'p-1.5 text-xs' : 'p-2 sm:px-2.5 sm:py-2 text-xs sm:text-sm'
      } ${className}`}
    >
      {/* Animated Icon Container */}
      <span className="relative w-4 h-4 sm:w-4.5 sm:h-4.5 flex items-center justify-center transition-transform duration-300">
        {isDark ? (
          <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-400 transition-all duration-300 rotate-0 scale-100 animate-spin-slow" />
        ) : (
          <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-cyan-400 transition-all duration-300 -rotate-12 scale-100" />
        )}
      </span>

      {showLabel && (
        <span className="font-semibold text-xs transition-colors text-slate-200">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
