import React, { useState } from 'react';
import { 
  LogIn, 
  UserPlus, 
  KeyRound, 
  Sparkles, 
  ShieldCheck, 
  LogOut, 
  BookOpen, 
  ArrowLeft,
  User as UserIcon,
  Smile
} from 'lucide-react';
import { LoginView } from './LoginView';
import { RegisterView } from './RegisterView';
import { RecoveryView } from './RecoveryView';
import { UpdatePasswordView } from './UpdatePasswordView';
import { AuthMode, SupabaseProfile, SupabaseUser } from '../../types';
import { signOutFromSupabase, fetchUserProfile } from '../../lib/authService';

interface AuthScreenProps {
  currentUser: SupabaseUser | null;
  currentProfile: SupabaseProfile | null;
  onAuthChange: (user: SupabaseUser | null, profile: SupabaseProfile | null) => void;
  onBackToApp?: () => void;
  showToast: (type: 'success' | 'error' | 'info', title: string, description?: string) => void;
  initialMode?: AuthMode;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  currentUser,
  currentProfile,
  onAuthChange,
  onBackToApp,
  showToast,
  initialMode = 'login',
}) => {
  const [activeMode, setActiveMode] = useState<AuthMode>(initialMode);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOutFromSupabase();
      if (typeof window !== 'undefined' && window.localStorage) {
        const keysToRemove: string[] = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (key && (
            key.startsWith('sb-') || 
            key.startsWith('superlectores_profile') || 
            key === 'superlectores_records' || 
            key === 'superlectores_evaluations' ||
            key === 'superlectores_current_tab' ||
            key.includes('supabase')
          )) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((k) => window.localStorage.removeItem(k));
      }
      onAuthChange(null, null);
      showToast('info', 'Sesión cerrada', 'Has salido de tu cuenta y se han limpiado los datos de sesión.');
      setActiveMode('login');
    } catch (err: any) {
      showToast('error', 'Error al salir', err?.message || 'No se pudo cerrar la sesión.');
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleAuthSuccess = async (user: SupabaseUser) => {
    try {
      const prof = await fetchUserProfile(user.id);
      onAuthChange(user, prof);
    } catch (err) {
      onAuthChange(user, null);
    }
  };

  return (
    <div id="auth-screen-container" className="min-h-[85vh] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Top back button */}
      {onBackToApp && (
        <div className="w-full max-w-lg mb-4 flex items-center justify-between">
          <button
            id="btn-auth-back-to-app"
            type="button"
            onClick={onBackToApp}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 shadow-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Mis Cuentos</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Supabase Auth Nativo</span>
          </div>
        </div>
      )}

      {/* Main Auth Card */}
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Brand Banner */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-6 sm:p-8 text-white relative">
          <div className="flex items-center gap-3">
            <img
              src="/logo_superlectores.png"
              alt="Super Lectores"
              className="w-13 h-13 rounded-full object-cover border-2 border-amber-400/50 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  Super Lectores
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider text-indigo-100">
                  Plan Gratuito
                </span>
              </div>
              <p className="text-xs sm:text-sm text-indigo-100 mt-0.5 font-medium">
                Portal de Acceso para Estudiantes y Familias
              </p>
            </div>
          </div>
        </div>

        {/* If Already Logged In: Account Dashboard Card */}
        {currentUser ? (
          <div id="auth-signed-in-card" className="p-6 sm:p-8 space-y-6">
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0">
                {currentProfile?.child_name ? currentProfile.child_name.charAt(0).toUpperCase() : 'L'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-black text-slate-900 truncate">
                    {currentProfile?.child_name || 'Estudiante Lector'}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 text-[10px] font-bold">
                    Conectado
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium truncate">
                  {currentUser.email}
                </p>
                {currentProfile?.full_name && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tutor responsable: <span className="font-semibold text-slate-700">{currentProfile.full_name}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Tabla Vinculada
                </p>
                <p className="text-sm font-extrabold text-slate-800 mt-0.5">
                  public.profiles
                </p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Seguridad
                </p>
                <p className="text-sm font-extrabold text-emerald-600 mt-0.5 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Activa
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
              {onBackToApp && (
                <button
                  type="button"
                  onClick={onBackToApp}
                  className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-all text-center cursor-pointer"
                >
                  Ir a Mis Cuentos
                </button>
              )}
              <button
                id="btn-auth-logout"
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="py-3 px-4 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-bold rounded-xl border border-slate-200 hover:border-rose-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <LogOut className="w-4 h-4" />
                <span>{isSigningOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Form views: Login, Register, Recovery */
          <div className="p-6 sm:p-8">
            {/* Mode Switcher Tabs */}
            <div className="flex rounded-2xl bg-slate-100 p-1 mb-6">
              <button
                id="tab-btn-login"
                type="button"
                onClick={() => setActiveMode('login')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeMode === 'login'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Iniciar Sesión</span>
              </button>

              <button
                id="tab-btn-register"
                type="button"
                onClick={() => setActiveMode('register')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeMode === 'register'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Crear Cuenta</span>
              </button>

              <button
                id="tab-btn-recovery"
                type="button"
                onClick={() => setActiveMode('recovery')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeMode === 'recovery' || activeMode === 'update-password'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Recuperar</span>
              </button>
            </div>

            {/* Render selected view */}
            {activeMode === 'login' && (
              <LoginView
                onSuccess={handleAuthSuccess}
                onNavigateToRegister={() => setActiveMode('register')}
                onNavigateToRecovery={() => setActiveMode('recovery')}
                showToast={showToast}
              />
            )}

            {activeMode === 'register' && (
              <RegisterView
                onSuccess={handleAuthSuccess}
                onNavigateToLogin={() => setActiveMode('login')}
                showToast={showToast}
              />
            )}

            {activeMode === 'recovery' && (
              <RecoveryView
                onNavigateToLogin={() => setActiveMode('login')}
                showToast={showToast}
              />
            )}

            {activeMode === 'update-password' && (
              <UpdatePasswordView
                onSuccess={() => setActiveMode('login')}
                onNavigateToLogin={() => setActiveMode('login')}
                showToast={showToast}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
