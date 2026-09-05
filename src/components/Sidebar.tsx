import React from 'react';
import { TabType, ChildProfile, AuthMode, SupabaseProfile, SupabaseUser } from '../types';
import { 
  LayoutDashboard, 
  BookOpen, 
  Gamepad2, 
  BarChart3, 
  FolderKanban,
  ShieldCheck,
  LogIn,
  UserCheck,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  profile: ChildProfile;
  currentUser?: SupabaseUser | null;
  currentSupabaseProfile?: SupabaseProfile | null;
  onOpenAuthModal?: (mode?: AuthMode) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  profile,
  currentUser,
  currentSupabaseProfile,
  onOpenAuthModal,
}) => {
  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <LayoutDashboard className="w-5 h-5" /> 
    },
    { 
      id: 'operations', 
      label: 'Mis Cuentos', 
      icon: <BookOpen className="w-5 h-5" /> 
    },
    { 
      id: 'settings', 
      label: 'Zona de Juegos', 
      icon: <Gamepad2 className="w-5 h-5" /> 
    },
    { 
      id: 'records', 
      label: 'Progreso', 
      icon: <BarChart3 className="w-5 h-5" /> 
    },
    { 
      id: 'landing', 
      label: 'Landing Page', 
      icon: <Sparkles className="w-5 h-5 text-indigo-500" /> 
    },
  ];

  // Calculate progress toward next level (max 600 XP per level bracket)
  const currentXP = profile.score % 600;
  const xpNeeded = 600;
  const xpRemaining = Math.max(0, xpNeeded - currentXP);
  const progressPct = Math.min(100, Math.round((currentXP / xpNeeded) * 100));

  return (
    <aside 
      id="sidebar-navigation" 
      className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col shrink-0 sticky top-0 h-screen select-none"
    >
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-100">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-xs">
          SL
        </div>
        <div>
          <span className="font-bold text-lg tracking-tight text-slate-900 block leading-tight">
            SuperLectores
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            LecturaKids • Pre-MVP
          </span>
        </div>
      </div>

      {/* Navigation links */}
      <nav id="sidebar-nav-list" className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-link-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors text-left ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Supabase Account trigger in sidebar */}
        <div className="pt-2 border-t border-slate-100 mt-2">
          {currentUser ? (
            <button
              id="btn-sidebar-supabase-account"
              type="button"
              onClick={() => onSelectTab('auth')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                currentTab === 'auth'
                  ? 'bg-emerald-100 text-emerald-900 ring-2 ring-emerald-500 shadow-xs'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="block truncate leading-tight">
                  {currentSupabaseProfile?.child_name || 'Mi Cuenta'}
                </span>
                <span className="text-[10px] text-emerald-600 font-medium block">
                  Supabase Activo
                </span>
              </div>
            </button>
          ) : (
            <button
              id="btn-sidebar-supabase-login"
              type="button"
              onClick={() => onSelectTab('auth')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                currentTab === 'auth'
                  ? 'bg-indigo-100 text-indigo-900 ring-2 ring-indigo-500 shadow-xs'
                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100'
              }`}
            >
              <LogIn className="w-4 h-4 text-indigo-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="block leading-tight">Iniciar Sesión</span>
                <span className="text-[10px] text-indigo-500 font-medium block">
                  Crea tu cuenta
                </span>
              </div>
            </button>
          )}
        </div>
      </nav>

      {/* Sidebar Level / Status Widget */}
      <div className="mt-auto p-4">
        <div className="bg-slate-900 rounded-2xl p-4 text-white relative overflow-hidden shadow-md">
          <div className="relative z-10">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">
              Nivel Actual
            </p>
            <h4 className="text-2xl font-black mt-1 tracking-tight">
              Explorador {profile.level}
            </h4>
            <div className="w-full bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-indigo-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPct || 65}%` }}
              />
            </div>
            <p className="text-[10px] mt-2 text-slate-400 font-medium">
              {xpRemaining} XP para Nivel {profile.level + 1}
            </p>
          </div>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-indigo-500 opacity-20 rounded-full pointer-events-none" />
        </div>
      </div>
    </aside>
  );
};
