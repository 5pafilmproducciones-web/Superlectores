import React, { useState, useRef, useEffect } from 'react';
import { TabType, ChildProfile, AuthMode, SupabaseProfile, SupabaseUser } from '../types';
import { 
  BookOpen, 
  LayoutDashboard, 
  Gamepad2, 
  BarChart3, 
  RotateCcw, 
  FileText,
  Gem,
  LogIn,
  ShieldCheck,
  Sparkles,
  Share2,
  MoreVertical,
  X,
  User
} from 'lucide-react';

interface NavbarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  profile: ChildProfile;
  onResetSeedData: () => void;
  onOpenReportModal: () => void;
  currentUser?: SupabaseUser | null;
  currentSupabaseProfile?: SupabaseProfile | null;
  onOpenAuthModal?: (mode?: AuthMode) => void;
  onOpenShareModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  profile,
  onResetSeedData,
  onOpenReportModal,
  currentUser,
  currentSupabaseProfile,
  onOpenAuthModal,
  onOpenShareModal,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Tab definitions: mobile uses concise punchy labels
  const tabs: { id: TabType; label: string; mobileLabel: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', mobileLabel: 'Inicio', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'operations', label: 'Mis Cuentos', mobileLabel: 'Cuentos', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'settings', label: 'Zona de Juegos', mobileLabel: 'Juegos', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'records', label: 'Progreso', mobileLabel: 'Progreso', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <header 
      id="main-header" 
      className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-30 shrink-0 w-full max-w-full"
    >
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-2 sm:py-3 flex items-center justify-between gap-2">
        {/* Left: Brand logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div 
            onClick={() => onSelectTab('landing')}
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group"
            title="Ir a página de inicio"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-tr from-amber-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xs sm:text-sm shadow-xs group-hover:scale-105 transition-transform">
              LK
            </div>
            <span className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
              Lectura<span className="text-amber-500">Kids</span>
            </span>
          </div>

          {/* Local Services status indicator on Desktop */}
          <div 
            id="local-services-pill"
            className="hidden lg:flex items-center gap-1.5 ml-2 pl-3 border-l border-slate-200"
            title="Sincronización LocalStorage activa al 100%"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-500 uppercase tracking-tight">
              Servicios Locales Activos
            </span>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Gem counter pill (Always visible on mobile & desktop) */}
          <div 
            id="header-child-stats"
            onClick={() => onSelectTab('settings')}
            className="flex items-center gap-1 sm:gap-1.5 bg-amber-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-amber-200/90 gem-pulse cursor-pointer hover:bg-amber-100 transition-all shadow-2xs shrink-0"
            title="Gemas acumuladas - Toca para ir al Salón de Juegos"
          >
            <span className="text-sm sm:text-base leading-none">💎</span>
            <span className="font-black text-xs sm:text-sm text-amber-800">{profile.gems}</span>
          </div>

          {/* Desktop Only Buttons (hidden on phones to prevent clipping) */}
          <div className="hidden md:flex items-center gap-1.5 sm:gap-2">
            {/* Landing Page */}
            <button
              id="btn-open-landing"
              type="button"
              onClick={() => onSelectTab('landing')}
              className="px-2.5 py-1.5 rounded-xl text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
              title="Ver Landing Page de presentación"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Landing</span>
            </button>

            {/* Compartir */}
            <button
              id="btn-open-share"
              type="button"
              onClick={onOpenShareModal}
              className="px-2.5 py-1.5 rounded-xl text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
              title="Compartir enlace con amigos o alumnos"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>Compartir</span>
            </button>

            {/* Reporte PDF */}
            <button
              id="btn-open-report"
              type="button"
              onClick={onOpenReportModal}
              className="px-2.5 py-1.5 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
              title="Vista previa e impresión de Reporte PDF"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>Reporte</span>
            </button>

            {/* Supabase Authentication Button */}
            <div className="pl-1 border-l border-slate-200">
              {currentUser ? (
                <button
                  id="btn-navbar-auth-active"
                  type="button"
                  onClick={() => onOpenAuthModal?.('login')}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition-all cursor-pointer"
                  title={`Conectado como ${currentUser.email}`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate max-w-[90px]">
                    {currentSupabaseProfile?.child_name || currentUser.email?.split('@')[0]}
                  </span>
                </button>
              ) : (
                <button
                  id="btn-navbar-open-login"
                  type="button"
                  onClick={() => onOpenAuthModal?.('login')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
                  title="Iniciar sesión o registrarse"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>Ingresar</span>
                </button>
              )}
            </div>

            {/* Reset seed only on xl desktop */}
            <button
              id="btn-reset-seed-data"
              type="button"
              onClick={onResetSeedData}
              className="hidden xl:flex p-1.5 text-xs font-medium text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-xl transition-colors items-center gap-1"
              title="Restablecer Datos Semilla"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Student Profile avatar (Always neatly framed and visible) */}
          <div 
            id="header-profile-button"
            onClick={() => onSelectTab('settings')}
            className="flex items-center gap-1.5 cursor-pointer group shrink-0 pl-1 sm:pl-2 border-l border-slate-200"
            title="Perfil de estudiante y ajustes"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-100 border-2 border-indigo-300 flex items-center justify-center overflow-hidden shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
              <img 
                src={profile.avatar} 
                alt={profile.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                {profile.name}
              </p>
              <p className="text-[10px] text-slate-500 leading-tight">
                {profile.age} años
              </p>
            </div>
          </div>

          {/* Mobile Menu Trigger Button (md:hidden) */}
          <div className="relative md:hidden shrink-0" ref={menuRef}>
            <button
              id="btn-mobile-more-menu"
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                isMobileMenuOpen 
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700' 
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
              title="Más opciones de la app"
              aria-label="Más opciones"
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4 text-indigo-600" />
              ) : (
                <MoreVertical className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Mobile Dropdown Popover */}
            {isMobileMenuOpen && (
              <div 
                id="mobile-dropdown-menu"
                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Opciones</p>
                  <p className="text-xs font-bold text-slate-800 truncate">{profile.name} (Nivel {profile.level})</p>
                </div>

                {/* Compartir App */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenShareModal?.();
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-bold text-indigo-700 hover:bg-indigo-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <Share2 className="w-3.5 h-3.5" />
                  </div>
                  <span>Compartir con clientes</span>
                </button>

                {/* Reporte de Lectura */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenReportModal();
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <span>Ver Reporte de Lectura</span>
                </button>

                {/* Ver Landing Page */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onSelectTab('landing');
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span>Página de Presentación</span>
                </button>

                {/* Cuenta Supabase Auth */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAuthModal?.('login');
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer border-t border-slate-100 mt-1 pt-2"
                >
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    {currentUser ? <ShieldCheck className="w-3.5 h-3.5" /> : <LogIn className="w-3.5 h-3.5" />}
                  </div>
                  <span className="truncate">
                    {currentUser ? 'Gestionar Cuenta' : 'Iniciar Sesión'}
                  </span>
                </button>

                {/* Reset Data */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onResetSeedData();
                  }}
                  className="w-full px-3 py-2 text-left text-[11px] text-slate-500 hover:text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                    <RotateCcw className="w-3 h-3" />
                  </div>
                  <span>Restablecer datos</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Tabs (4 columns, strictly responsive, zero overflow) */}
      <nav 
        id="mobile-navigation-tabs"
        className="lg:hidden grid grid-cols-4 gap-1 p-1.5 border-t border-slate-200/80 bg-slate-50/95 w-full max-w-full"
      >
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-mobile-${tab.id}`}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer select-none text-center ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <div className="shrink-0 mb-0.5">{tab.icon}</div>
              <span className="text-[10px] font-bold leading-tight truncate w-full">
                {tab.mobileLabel}
              </span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
