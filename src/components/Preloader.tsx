import React, { useEffect, useState } from 'react';
import { Sparkles, BookOpen } from 'lucide-react';

interface PreloaderProps {
  onFinish?: () => void;
  minDuration?: number; // milliseconds
}

export const Preloader: React.FC<PreloaderProps> = ({ 
  onFinish,
  minDuration = 1200 
}) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      const finishTimer = setTimeout(() => {
        if (onFinish) onFinish();
      }, 400); // Wait for CSS fade transition
      return () => clearTimeout(finishTimer);
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration, onFinish]);

  return (
    <div
      id="app-preloader"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 transition-opacity duration-400 select-none ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background magical ambient glow */}
      <div className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gradient-to-tr from-amber-500/20 via-indigo-600/25 to-violet-500/20 blur-3xl pointer-events-none animate-pulse" />

      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-sm">
        {/* Animated Logo Container */}
        <div className="relative mb-6">
          {/* Outer glowing pulsing ring */}
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 opacity-60 blur-md animate-spin duration-1000" />
          
          {/* Circular logo */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 shadow-2xl shadow-amber-500/30 flex items-center justify-center overflow-hidden">
            <img
              src="/logo_superlectores.png"
              alt="Super Lectores"
              className="w-full h-full object-cover rounded-full animate-pulse"
              onError={(e) => {
                // Fallback in case image fails to load
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          {/* Sparkle badge */}
          <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1.5 rounded-full shadow-lg border-2 border-slate-950 animate-bounce">
            <Sparkles className="w-4 h-4 fill-slate-950" />
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-1.5">
          <span>Super</span>
          <span className="text-amber-400">Lectores</span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
          Aprende, lee y gana gemas mágicas
        </p>

        {/* Progress Bar and Indicator */}
        <div className="w-48 sm:w-56 h-1.5 bg-slate-800 rounded-full mt-6 overflow-hidden relative">
          <div className="h-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300 rounded-full animate-indeterminate" />
        </div>

        <span className="text-[11px] text-amber-300/80 font-semibold tracking-wide mt-3 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          Cargando biblioteca mágica...
        </span>
      </div>
    </div>
  );
};
