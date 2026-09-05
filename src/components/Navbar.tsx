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
      className="h-20 border-b border-slate-200 bg-white flex flex-col justify-center px-4 sm:px-6 lg:px-8 sticky top-0 z-30 shrink-0"
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left: Active local status indicator (Desktop) & Brand on mobile */}
        <div className="flex items-center gap-3">
          {/* Mobile brand badge */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-xs">
              SL
            </div>
            <span className="font-bold text-base text-slate-900 tracking-tight">SuperLectores</span>
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
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Gem counter pill with .gem-pulse */}
          <div 
            id="header-child-stats"
            onClick={() => onSelectTab('settings')}
            className="flex items-center gap-2 bg-amber-50 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-amber-100 gem-pulse cursor-pointer hover:bg-amber-100/70 transition-all shadow-xs"
            title="Gemas acumuladas - Haz clic para ir al Salón de Juegos"
          >
            <span className="text-lg sm:text-xl">💎</span>
            <span className="font-bold text-sm sm:text-base text-amber-700">{profile.gems}</span>
          </div>

          {/* Supabase Authentication Button / Account Badge */}
          <div className="pl-2 sm:pl-4 border-l border-slate-200">
            {currentUser ? (
              <button
                id="btn-navbar-auth-active"
                type="button"
                onClick={() => onOpenAuthModal?.('login')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                title={`Conectado como ${currentUser.email} - Haz clic para ver cuenta o cerrar sesión`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="hidden sm:inline truncate max-w-[120px]">
                  {currentSupabaseProfile?.child_name || currentUser.email?.split('@')[0]}
                </span>
                <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-1.5 py-0.2 rounded-md font-extrabold hidden md:inline">
                  Supabase
                </span>
              </button>
            ) : (
              <button
                id="btn-navbar-open-login"
                type="button"
                onClick={() => onOpenAuthModal?.('login')}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-extrabold transition-all shadow-xs hover:shadow-md cursor-pointer active:scale-95"
                title="Iniciar sesión o registrarse en Supabase"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="whitespace-nowrap">Iniciar Sesión</span>
              </button>
            )}
          </div>

          {/* Student Profile avatar and info */}
          <div 
            id="header-profile-button"
            onClick={() => onSelectTab('settings')}
            className="flex items-center gap-3 pl-3 sm:pl-4 border-l border-slate-200 cursor-pointer group"
            title="Perfil de estudiante y ajustes"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {profile.name}
              </p>
              <p className="text-xs text-slate-500">
                Estudiante • {profile.age} años
              </p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center overflow-hidden shadow-xs shrink-0">
              <img 
                src={profile.avatar} 
                alt={profile.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Action buttons: Landing Page, PDF Report & Reset Seed */}
          <div className="flex items-center gap-1.5 sm:gap-2 pl-2 sm:pl-4 border-l border-slate-200">
            <button
              id="btn-open-landing"
              onClick={() => onSelectTab('landing')}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200 transition-colors text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              title="Ver Landing Page de presentación"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Landing Page</span>
            </button>

            <button
              id="btn-open-report"
              onClick={onOpenReportModal}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 transition-colors text-xs font-semibold flex items-center gap-1.5"
              title="Vista previa e impresión de Reporte PDF"
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              <span className="hidden md:inline">Reporte</span>
            </button>

            <button
              id="btn-reset-seed-data"
              onClick={onResetSeedData}
              className="p-2 sm:px-3 sm:py-2 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
              title="Restablecer Datos Semilla de demostración"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Semilla</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Tabs (visible only on mobile/tablet) */}
      <div className="flex lg:hidden items-center justify-around pt-2 mt-1 border-t border-slate-100">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-mobile-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                isActive 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.icon}
              <span className="text-[11px] whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
