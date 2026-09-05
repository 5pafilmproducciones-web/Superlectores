import React, { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { getSupabase } from '../../lib/supabaseClient';
import { translateAuthError } from '../../lib/authService';

interface UpdatePasswordViewProps {
  onSuccess?: () => void;
  onNavigateToLogin?: () => void;
  showToast?: (type: 'success' | 'error' | 'info', title: string, description?: string) => void;
}

export const UpdatePasswordView: React.FC<UpdatePasswordViewProps> = ({
  onSuccess,
  onNavigateToLogin,
  showToast,
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (newPassword.length < 6) {
      setErrorMessage('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    const client = getSupabase();
    if (!client) {
      setErrorMessage('Supabase no está configurado.');
      return;
    }

    setIsLoading(true);

    try {
      // Método nativo de Supabase Auth para actualizar contraseña del usuario autenticado
      const { error } = await client.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        const friendlyError = translateAuthError(error);
        setErrorMessage(friendlyError);
        showToast?.('error', 'Error al actualizar contraseña', friendlyError);
        return;
      }

      setIsSuccess(true);
      showToast?.('success', '¡Contraseña actualizada!', 'Ya puedes iniciar sesión con tu nueva clave.');
      onSuccess?.();
    } catch (err: any) {
      const msg = err?.message || 'Error al actualizar la contraseña.';
      setErrorMessage(msg);
      showToast?.('error', 'Error', msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div id="update-password-success" className="w-full max-w-md mx-auto text-center py-4">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          ¡Contraseña Actualizada!
        </h3>
        <p className="text-sm text-slate-600 mt-2 font-medium">
          Tu nueva clave se ha guardado de manera segura en Supabase.
        </p>
        {onNavigateToLogin && (
          <button
            id="btn-update-back-to-login"
            type="button"
            onClick={onNavigateToLogin}
            className="mt-6 w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Continuar a Iniciar Sesión
          </button>
        )}
      </div>
    );
  }

  return (
    <div id="update-password-view" className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          Nueva Contraseña
        </h3>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Ingresa y confirma tu nueva contraseña para proteger tu cuenta de lector.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Error</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Nueva Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50"
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

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Confirmar Nueva Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Guardando nueva contraseña...</span>
            </>
          ) : (
            <span>Guardar Nueva Contraseña</span>
          )}
        </button>
      </form>
    </div>
  );
};
