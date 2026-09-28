import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface LogoProps {
  className?: string;
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'auto'; // 'dark' = white text, 'light' = dark text, 'auto' = adapts to active theme
  iconOnly?: boolean;
}

/**
 * Official Digital X 3D Ribbon "X" Symbol
 * Handcrafted vector SVG matching the official brand identity:
 * - Left stroke: Rich purple-to-royal-blue 3D gradient ribbon
 * - Right stroke: High-voltage cyan-to-azure aerodynamic angled ribbon
 * - Dimensional fold shadow creating optical depth
 */
export const DigitalXSymbol: React.FC<{
  className?: string;
  size?: number | string;
}> = ({ className = '', size = 32 }) => {
  const uniqueId = React.useId().replace(/:/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 overflow-visible ${className}`}
      aria-hidden="true"
    >
      <defs>
        {/* Violet to Royal Blue gradient for left stroke ribbon */}
        <linearGradient
          id={`dx-purple-${uniqueId}`}
          x1="22%"
          y1="18%"
          x2="80%"
          y2="88%"
        >
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="35%" stopColor="#4F46E5" />
          <stop offset="70%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>

        {/* Electric Cyan to Ocean Blue gradient for right stroke ribbon */}
        <linearGradient
          id={`dx-cyan-${uniqueId}`}
          x1="88%"
          y1="12%"
          x2="18%"
          y2="86%"
        >
          <stop offset="0%" stopColor="#00E5FF" />
          <stop offset="25%" stopColor="#00B4D8" />
          <stop offset="65%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#1E40AF" />
        </linearGradient>

        {/* Top-Right Angled Wing Accent Gradient */}
        <linearGradient
          id={`dx-wing-${uniqueId}`}
          x1="60%"
          y1="10%"
          x2="95%"
          y2="28%"
        >
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        {/* 3D Depth Crease / Fold Shadow */}
        <linearGradient
          id={`dx-fold-${uniqueId}`}
          x1="45%"
          y1="40%"
          x2="55%"
          y2="60%"
        >
          <stop offset="0%" stopColor="#0F172A" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* --- RIBBON STROKE 1: Top-Left to Bottom-Right (Purple / Indigo / Blue) --- */}
      {/* Upper-Left arm down to center */}
      <path
        d="M24 20C18 20 14 26 17 32L39 60C43 65 50 67 56 63L76 48C81 44 80 37 74 34L45 21C38 18 30 20 24 20Z"
        fill={`url(#dx-purple-${uniqueId})`}
      />
      {/* Lower-Right extension */}
      <path
        d="M48 50L73 80C78 86 87 85 90 79C93 73 89 65 83 60L60 38C54 42 50 46 48 50Z"
        fill={`url(#dx-purple-${uniqueId})`}
      />

      {/* --- RIBBON STROKE 2: Top-Right to Bottom-Left (Cyan / Electric Azure) --- */}
      {/* Upper-Right wing with distinct aerodynamic angled cut matching official logo */}
      <path
        d="M93 14L78 19L60 44L72 56L94 28C96 25 97 19 93 14Z"
        fill={`url(#dx-wing-${uniqueId})`}
      />

      {/* Continuous Cyan-Blue Ribbon crossing over to bottom-left */}
      <path
        d="M80 18L50 54L22 80C16 85 10 82 8 76C6 70 10 63 15 58L42 32L62 16C68 12 75 14 80 18Z"
        fill={`url(#dx-cyan-${uniqueId})`}
      />

      {/* Bottom-left smooth rounded return loop */}
      <path
        d="M10 74C8 79 12 85 18 85C24 85 30 81 35 76L55 52L44 42L18 66C14 70 11 71 10 74Z"
        fill={`url(#dx-cyan-${uniqueId})`}
      />

      {/* 3D Fold Shadow Overlap where the two ribbons interlock */}
      <path
        d="M42 42C48 48 54 53 58 57C54 62 48 64 43 59C38 54 38 47 42 42Z"
        fill={`url(#dx-fold-${uniqueId})`}
      />

      {/* Top Specular Sheen for 3D Luminous Polish */}
      <path
        d="M74 20L58 38C55 35 56 31 60 27L72 17C73 17 74 19 74 20Z"
        fill="#FFFFFF"
        fillOpacity="0.4"
      />
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({
  className = '',
  showSubtitle = true,
  size = 'md',
  variant = 'auto',
  iconOnly = false,
}) => {
  // Sizing definitions
  const dimensions = {
    sm: { symbol: 24, text: 'text-lg', subtitle: 'text-[8px]', gap: 'gap-1' },
    md: { symbol: 32, text: 'text-2xl', subtitle: 'text-[9px]', gap: 'gap-1.5' },
    lg: { symbol: 42, text: 'text-3xl', subtitle: 'text-[11px]', gap: 'gap-2' },
    xl: { symbol: 56, text: 'text-4xl', subtitle: 'text-[13px]', gap: 'gap-2.5' },
  };

  const dim = dimensions[size];

  const isExplicitLight = variant === 'light';

  // If icon-only requested (e.g. mobile favicon/small badges)
  if (iconOnly) {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <DigitalXSymbol size={dim.symbol} />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center ${dim.gap} select-none group ${className}`}>
      {/* Brand Wordmark & 3D Ribbon Symbol in exact locked lockup */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center">
          {/* "Digital" text in bold, clean geometric sans typography */}
          <span
            className={`font-extrabold tracking-[-0.03em] ${dim.text} ${
              isExplicitLight ? 'text-[#1E2229]' : 'text-white'
            } transition-colors font-['Outfit']`}
            style={{ fontWeight: 800 }}
          >
            Digital
          </span>

          {/* Official 3D Ribbon "X" Symbol */}
          <div className="relative inline-flex items-center justify-center -ml-0.5">
            <DigitalXSymbol size={dim.symbol} />
          </div>
        </div>

        {/* Corporate Affiliation Subtitle: "MULTI SERVICES PVT." */}
        {showSubtitle && (
          <div className="flex justify-end -mt-0.5">
            <span
              className={`font-bold uppercase tracking-[0.14em] ${dim.subtitle} ${
                isExplicitLight ? 'text-[#1E2229]/80' : 'text-slate-300'
              } font-['Outfit']`}
              style={{ fontWeight: 700 }}
            >
              MULTI SERVICES PVT.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logo;
