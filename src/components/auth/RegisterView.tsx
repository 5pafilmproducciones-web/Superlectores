import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  UserPlus, 
  User, 
  Smile, 
  Loader2, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';
import { getSupabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { translateAuthError } from '../../lib/authService';

interface RegisterViewProps {
  onSuccess?: (user: any) => void;
  onNavigateToLogin?: () => void;
  showToast?: (type: 'success' | 'error' | 'info', title: string, description?: string) => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({
  onSuccess,
  onNavigateToLogin,
  showToast,
}) => {
  const [fullName, setFullName] = useState('');
  const [childName, setChildName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccessConfirmation, setIsSuccessConfirmation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validaciones de formulario
    if (!childName.trim()) {
      setErrorMessage('Por favor escribe el nombre del estudiante lector.');
      return;
    }
    if (!fullName.trim()) {
      setErrorMessage('Por favor ingresa el nombre del tutor o padre.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Por favor ingresa un correo electrónico válido.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('La contraseña debe contener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden. Por favor verifícalas.');
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
      // 2. Llamada nativa de Supabase Auth
      const { data, error } = await client.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: fullName.trim(),
            child_name: childName.trim(),
          },
        },
      });

      if (error) {
        const friendlyError = translateAuthError(error);
        setErrorMessage(friendlyError);
        showToast?.('error', 'Error al crear cuenta', friendlyError);
        return;
      }

      // Supabase devuelve el usuario; si requiere confirmación por email, session puede ser null
      if (data?.user) {
        // Verificar si se requiere confirmación por email
        if (data.user.identities && data.user.identities.length === 0) {
          setErrorMessage('Este correo ya se encuentra registrado. Por favor inicia sesión.');
          showToast?.('error', 'Usuario existente', 'El correo ya está registrado.');
          return;
        }

        if (!data.session) {
          setIsSuccessConfirmation(true);
          showToast?.(
            'info',
            'Confirma tu correo',
            'Se ha enviado un enlace de confirmación a tu correo.'
          );
        } else {
          showToast?.(
            'success',
            '¡Cuenta creada con éxito!',
            `¡Bienvenido a Super Lectores, ${childName}!`
          );
          onSuccess?.(data.user);
        }
      }
    } catch (err: any) {
      const msg = err?.message || 'Ocurrió un error inesperado al registrar el usuario.';
      setErrorMessage(msg);
      showToast?.('error', 'Error inesperado', msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Pantalla de confirmación pendiente
  if (isSuccessConfirmation) {
    return (
      <div id="register-confirmation-view" className="w-full max-w-md mx-auto text-center py-4">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          ¡Casi listo! Revisa tu correo
        </h3>
        <p className="text-sm text-slate-600 mt-2 font-medium leading-relaxed">
          Hemos enviado un enlace de confirmación a{' '}
          <strong className="text-slate-900 font-bold">{email}</strong>.
        </p>
        <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 text-left space-y-1.5">
          <p className="font-bold text-slate-700">Pasos a seguir:</p>
          <p>1. Abre tu bandeja de entrada (revisa también spam).</p>
          <p>2. Haz clic en el botón de confirmación de Supabase.</p>
          <p>3. Regresa aquí para iniciar sesión e ingresar a tus cuentos.</p>
        </div>
        {onNavigateToLogin && (
          <button
            id="btn-confirmation-to-login"
            type="button"
            onClick={onNavigateToLogin}
            className="mt-6 w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Ir a Iniciar Sesión
          </button>
        )}
      </div>
    );
  }

  return (
    <div id="register-component-view" className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-2">
          <span>Suscripción al Plan Gratuito</span>
        </div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          Crea tu cuenta de explorador
        </h3>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Registra al pequeño lector para tener su puntuación real y guardar todas sus gemas.
        </p>
      </div>

      {/* Alerta de configuración de Supabase si falta */}
      {!isSupabaseConfigured && (
        <div
          id="register-supabase-warning"
          className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2"
        >
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>Configura las credenciales de Supabase para habilitar registros reales.</p>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div
          id="register-error-banner"
          className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5 animate-fadeIn"
        >
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">No se pudo completar el registro</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Nombres: Estudiante y Tutor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="register-input-child-name"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
            >
              Nombre del Niño/a
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Smile className="w-4 h-4" />
              </div>
              <input
                id="register-input-child-name"
                type="text"
                required
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Ej. Mateo"
                disabled={isLoading}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="register-input-full-name"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
            >
              Nombre del Tutor
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="register-input-full-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej. Carlos Silva"
                disabled={isLoading}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Campo Correo Electrónico */}
        <div>
          <label
            htmlFor="register-input-email"
            className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
          >
            Correo Electrónico
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="register-input-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tutor@ejemplo.com"
              disabled={isLoading}
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
            />
          </div>
        </div>

        {/* Campo Contraseña */}
        <div>
          <label
            htmlFor="register-input-password"
            className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
          >
            Contraseña (Mínimo 6 caracteres)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="register-input-password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
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

        {/* Campo Confirmar Contraseña */}
        <div>
          <label
            htmlFor="register-input-confirm-password"
            className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
          >
            Confirmar Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="register-input-confirm-password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              className="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
            />
          </div>
        </div>

        {/* Botón Submit de Registro */}
        <button
          id="btn-register-submit"
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creando tu cuenta...</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Crear Cuenta de Lector</span>
            </>
          )}
        </button>
      </form>

      {/* Footer para volver a Login */}
      {onNavigateToLogin && (
        <div className="mt-5 pt-4 border-t border-slate-100 text-center text-xs text-slate-500 font-medium">
          ¿Ya tienes una cuenta registrada?{' '}
          <button
            id="btn-switch-to-login"
            type="button"
            onClick={onNavigateToLogin}
            className="text-indigo-600 hover:text-indigo-800 font-bold ml-1 cursor-pointer transition-colors underline"
          >
            Inicia sesión aquí
          </button>
        </div>
      )}
    </div>
  );
};
