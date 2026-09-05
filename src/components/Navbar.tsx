import React from 'react';
import { TabType, ChildProfile, AuthMode, SupabaseProfile, SupabaseUser } from '../types';
import { 
  BookOpen, 
  LayoutDashboard, 
  Gamepad2, 
  BarChart3, 
  RotateCcw, 
  FileText,
  Gem,
  Award,
  LogIn,
  ShieldCheck,
  UserCheck,
  Sparkles
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
}) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'operations', label: 'Mis Cuentos', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'settings', label: 'Zona de Juegos', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'records', label: 'Progreso', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <header 
      id="main-header" 
      className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-30 shrink-0 w-full max-w-full overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand on mobile / local status on Desktop */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile brand badge */}
          <div className="lg:hidden flex items-center gap-1.5 sm:gap-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-tr from-amber-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xs sm:text-sm shadow-xs">
              LK
            </div>
            <span className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
              Lectura<span className="text-amber-500">Kids</span>
            </span>
          </div>

          {/* Local Services status indicator */}
          <div 
            id="local-services-pill"
            className="hidden sm:flex items-center gap-2"
            title="Sincronización LocalStorage activa al 100%"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-tight">
              Servicios Locales Activos
            </span>
          </div>
        </div>

        {/* Right side controls: Gem pulse, student card, utilities */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Gem counter pill */}
          <div 
            id="header-child-stats"
            onClick={() => onSelectTab('settings')}
            className="flex items-center gap-1 sm:gap-2 bg-amber-50 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-amber-200/80 gem-pulse cursor-pointer hover:bg-amber-100 transition-all shadow-2xs"
            title="Gemas acumuladas - Clic para ir al Salón de Juegos"
          >
            <span className="text-sm sm:text-lg leading-none">💎</span>
            <span className="font-black text-xs sm:text-sm text-amber-800">{profile.gems}</span>
          </div>

          {/* Botón Landing Page */}
          <button
            id="btn-open-landing"
            onClick={() => onSelectTab('landing')}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
            title="Ver Landing Page de presentación"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="hidden sm:inline">Landing</span>
          </button>

          {/* Botón Reporte PDF */}
          <button
            id="btn-open-report"
            onClick={onOpenReportModal}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 transition-colors text-xs font-semibold flex items-center gap-1"
            title="Vista previa e impresión de Reporte PDF"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="hidden md:inline">Reporte</span>
          </button>

          {/* Supabase Authentication Button / Account Badge */}
          <div className="pl-1.5 sm:pl-2 border-l border-slate-200">
            {currentUser ? (
              <button
                id="btn-navbar-auth-active"
                type="button"
                onClick={() => onOpenAuthModal?.('login')}
                className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition-all cursor-pointer"
                title={`Conectado como ${currentUser.email} - Clic para ver cuenta o cerrar sesión`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="hidden md:inline truncate max-w-[100px]">
                  {currentSupabaseProfile?.child_name || currentUser.email?.split('@')[0]}
                </span>
              </button>
            ) : (
              <button
                id="btn-navbar-open-login"
                type="button"
                onClick={() => onOpenAuthModal?.('login')}
                className="flex items-center gap-1 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
                title="Iniciar sesión o registrarse"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="hidden sm:inline whitespace-nowrap">Ingresar</span>
              </button>
            )}
          </div>

          {/* Student Profile avatar and info */}
          <div 
            id="header-profile-button"
            onClick={() => onSelectTab('settings')}
            className="flex items-center gap-2 pl-1.5 sm:pl-2 border-l border-slate-200 cursor-pointer group shrink-0"
            title="Perfil de estudiante y ajustes"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center overflow-hidden shadow-2xs shrink-0">
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

          {/* Reset seed only on desktop */}
          <button
            id="btn-reset-seed-data"
            onClick={onResetSeedData}
            className="hidden xl:flex p-2 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-xl transition-colors items-center gap-1"
            title="Restablecer Datos Semilla"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Semilla</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Tabs: scrollable and clean touch-friendly */}
      <div className="flex lg:hidden items-center justify-around px-2 py-1.5 border-t border-slate-100 bg-slate-50/90 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-mobile-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 py-1 px-2 text-[10px] sm:text-xs font-bold rounded-lg transition-colors whitespace-nowrap min-w-[58px] ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <div className="shrink-0">{tab.icon}</div>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
