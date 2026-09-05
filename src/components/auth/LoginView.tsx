import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2, AlertCircle } from 'lucide-react';
import { getSupabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { translateAuthError } from '../../lib/authService';

interface LoginViewProps {
  onSuccess?: (user: any) => void;
  onNavigateToRegister?: () => void;
  onNavigateToRecovery?: () => void;
  showToast?: (type: 'success' | 'error' | 'info', title: string, description?: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onSuccess,
  onNavigateToRegister,
  onNavigateToRecovery,
  showToast,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validación básica de campos
    if (!email.trim()) {
      setErrorMessage('Por favor ingresa tu correo electrónico.');
      return;
    }
    if (!password) {
      setErrorMessage('Por favor ingresa tu contraseña.');
      return;
    }

    const client = getSupabase();
    if (!client) {
      setErrorMessage(
        'Supabase no está configurado. Por favor define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu entorno.'
      );
      return;
    }

    setIsLoading(true);

    try {
      // 1. Llamada nativa de Supabase Auth
      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        const friendlyError = translateAuthError(error);
        setErrorMessage(friendlyError);
        showToast?.('error', 'Error al iniciar sesión', friendlyError);
        return;
      }

      if (data?.user) {
        showToast?.('success', '¡Bienvenido de vuelta!', 'Sesión iniciada correctamente.');
        onSuccess?.(data.user);
      }
    } catch (err: any) {
      const msg = err?.message || 'Ocurrió un error inesperado al iniciar sesión.';
      setErrorMessage(msg);
      showToast?.('error', 'Error inesperado', msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="login-component-view" className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          ¡Hola de nuevo!
        </h3>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Ingresa tus credenciales para continuar tu aventura lectora.
        </p>
      </div>

      {/* Alerta de configuración de Supabase si falta */}
      {!isSupabaseConfigured && (
        <div
          id="login-supabase-warning"
          className="mb-4 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2.5"
        >
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Variables de Supabase no detectadas</p>
            <p className="mt-0.5 text-amber-700">
              Asegúrate de configurar <code className="font-mono font-bold">VITE_SUPABASE_URL</code> y <code className="font-mono font-bold">VITE_SUPABASE_ANON_KEY</code>.
            </p>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div
          id="login-error-banner"
          className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5 animate-fadeIn"
        >
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">No se pudo iniciar sesión</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo Correo Electrónico */}
        <div>
          <label
            htmlFor="login-input-email"
            className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            Correo Electrónico
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="login-input-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="padre_o_estudiante@ejemplo.com"
              disabled={isLoading}
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
            />
          </div>
        </div>

        {/* Campo Contraseña */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="login-input-password"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
            >
              Contraseña
            </label>
            {onNavigateToRecovery && (
              <button
                id="btn-link-forgot-password"
                type="button"
                onClick={onNavigateToRecovery}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            )}
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="login-input-password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Botón Submit de Inicio de Sesión */}
        <button
          id="btn-login-submit"
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Iniciando sesión...</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Iniciar Sesión</span>
            </>
          )}
        </button>
      </form>

      {/* Footer para cambiar a Registro */}
      {onNavigateToRegister && (
        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500 font-medium">
          ¿No tienes una cuenta aún?{' '}
          <button
            id="btn-switch-to-register"
            type="button"
            onClick={onNavigateToRegister}
            className="text-indigo-600 hover:text-indigo-800 font-bold ml-1 cursor-pointer transition-colors underline"
          >
            Regístrate gratis
          </button>
        </div>
      )}
    </div>
  );
};
