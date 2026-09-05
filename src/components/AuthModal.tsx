import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { AuthScreen } from './auth';
import { AuthMode, SupabaseProfile, SupabaseUser } from '../types';
import { getSupabase } from '../lib/supabaseClient';
import { fetchUserProfile } from '../lib/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: SupabaseUser | null;
  currentProfile: SupabaseProfile | null;
  onAuthChange: (user: SupabaseUser | null, profile: SupabaseProfile | null) => void;
  initialMode?: AuthMode;
  showToast: (type: 'success' | 'error' | 'info', title: string, description?: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  currentProfile,
  onAuthChange,
  initialMode = 'login',
  showToast,
}) => {
  // Listen for Supabase recovery events in the URL
  useEffect(() => {
    const client = getSupabase();
    if (!client) return;

    const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        showToast('info', 'Recuperación de contraseña', 'Ingresa tu nueva contraseña para actualizarla.');
      } else if (event === 'SIGNED_IN' && session?.user) {
        fetchUserProfile(session.user.id).then((prof) => {
          onAuthChange(session.user as SupabaseUser, prof);
        });
      } else if (event === 'SIGNED_OUT') {
        onAuthChange(null, null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [onAuthChange, showToast]);

  if (!isOpen) return null;

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-lg my-auto">
        {/* Close button */}
        <button
          id="btn-close-auth-modal"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Cerrar ventana de autenticación"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Embedded AuthScreen component */}
        <AuthScreen
          currentUser={currentUser}
          currentProfile={currentProfile}
          onAuthChange={(user, profile) => {
            onAuthChange(user, profile);
            if (user) {
              onClose();
            }
          }}
          onBackToApp={onClose}
          showToast={showToast}
          initialMode={initialMode}
        />
      </div>
    </div>
  );
};
