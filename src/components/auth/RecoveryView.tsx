import React, { useState } from 'react';
import { Mail, KeyRound, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { getSupabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { translateAuthError } from '../../lib/authService';

interface RecoveryViewProps {
  onSuccess?: () => void;
  onNavigateToLogin?: () => void;
  showToast?: (type: 'success' | 'error' | 'info', title: string, description?: string) => void;
}

export const RecoveryView: React.FC<RecoveryViewProps> = ({
  onSuccess,
  onNavigateToLogin,
  showToast,
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccessSent, setIsSuccessSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Por favor ingresa tu correo electrónico.');
      return;
    }

    const client = getSupabase();
    if (!client) {
      setErrorMessage(
        'Supabase no está configurado. Por favor define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.'
      );
      return;
    }

    setIsLoading(true);

    try {
      // 3. Llamada nativa de Supabase Auth para restablecimiento
      const redirectUrl = typeof window !== 'undefined' ? window.location.origin : undefined;
      const { error } = await client.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });

      if (error) {
        const friendlyError = translateAuthError(error);
        setErrorMessage(friendlyError);
        showToast?.('error', 'Error al solicitar recuperación', friendlyError);
        return;
      }

      setIsSuccessSent(true);
      showToast?.(
        'success',
        'Correo enviado',
        'Revisa tu bandeja de entrada con el enlace de recuperación.'
      );
      onSuccess?.();
    } catch (err: any) {
      const msg = err?.message || 'Error inesperado al enviar el correo de recuperación.';
      setErrorMessage(msg);
      showToast?.('error', 'Error inesperado', msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Pantalla de éxito tras el envío
  if (isSuccessSent) {
    return (
      <div id="recovery-success-view" className="w-full max-w-md mx-auto text-center py-4">
        <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          ¡Correo de recuperación enviado!
        </h3>
        <p className="text-sm text-slate-600 mt-2 font-medium leading-relaxed">
          Hemos enviado las instrucciones para restablecer tu contraseña a{' '}
          <strong className="text-slate-900 font-bold">{email}</strong>.
        </p>
        <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 text-left space-y-2">
          <p className="font-bold text-slate-700">¿No encuentras el correo?</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Espera entre 1 y 2 minutos.</li>
            <li>Revisa la carpeta de correos no deseados (Spam / Promociones).</li>
            <li>Haz clic en el enlace para asignar una nueva contraseña segura.</li>
          </ul>
        </div>

        {onNavigateToLogin && (
          <button
            id="btn-recovery-back-to-login"
            type="button"
            onClick={onNavigateToLogin}
            className="mt-6 w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Iniciar Sesión</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div id="recovery-component-view" className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          Recuperar Contraseña
        </h3>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Ingresa el correo asociado a tu cuenta de LecturaKids para recibir un enlace seguro de restablecimiento.
        </p>
      </div>

      {/* Alerta de configuración de Supabase si falta */}
      {!isSupabaseConfigured && (
        <div
          id="recovery-supabase-warning"
          className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2"
        >
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>Configura las credenciales de Supabase para enviar correos de recuperación.</p>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div
          id="recovery-error-banner"
          className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5 animate-fadeIn"
        >
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">No se pudo enviar el correo</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="recovery-input-email"
            className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            Correo Electrónico
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="recovery-input-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu_correo@ejemplo.com"
              disabled={isLoading}
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
            />
          </div>
        </div>

        {/* Botón Submit */}
        <button
          id="btn-recovery-submit"
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Enviando enlace seguro...</span>
            </>
          ) : (
            <>
              <KeyRound className="w-4 h-4" />
              <span>Enviar Enlace de Recuperación</span>
            </>
          )}
        </button>
      </form>

      {/* Footer para regresar a Login */}
      {onNavigateToLogin && (
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <button
            id="btn-switch-back-to-login"
            type="button"
            onClick={onNavigateToLogin}
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-bold cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Regresar a Iniciar Sesión</span>
          </button>
        </div>
      )}
    </div>
  );
};
