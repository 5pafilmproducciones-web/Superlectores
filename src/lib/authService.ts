import type { User, Session, AuthError } from '@supabase/supabase-js';
import { getSupabase, isSupabaseConfigured } from './supabaseClient';
import { SupabaseProfile } from '../types';

export interface SignUpParams {
  email: string;
  password: string;
  fullName: string;
  childName: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface AuthResponse<T = any> {
  data: T | null;
  error: string | null;
}

export async function getCurrentSession(): Promise<{ session: Session | null; user: User | null }> {
  const client = getSupabase();
  if (!client) return { session: null, user: null };

  try {
    const { data: { session }, error } = await client.auth.getSession();
    if (error) {
      console.warn('Error fetching Supabase session:', error.message);
      return { session: null, user: null };
    }
    return { session, user: session?.user || null };
  } catch (err: any) {
    console.warn('Session check failed:', err?.message);
    return { session: null, user: null };
  }
}

export async function signUpWithSupabase(params: SignUpParams): Promise<AuthResponse<{ user: User | null; session: Session | null }>> {
  const client = getSupabase();
  if (!client) {
    return {
      data: null,
      error: 'Supabase no está configurado. Revisa las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu entorno.',
    };
  }

  try {
    const redirectUrl = typeof window !== 'undefined' ? window.location.origin : undefined;
    const { data, error } = await client.auth.signUp({
      email: params.email.trim(),
      password: params.password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: params.fullName.trim(),
          child_name: params.childName.trim() || 'Lector Estrella',
        },
      },
    });

    if (error) {
      return { data: null, error: translateAuthError(error) };
    }

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Error inesperado al registrar la cuenta' };
  }
}

export async function signInWithSupabase(params: SignInParams): Promise<AuthResponse<{ user: User | null; session: Session | null }>> {
  const client = getSupabase();
  if (!client) {
    return {
      data: null,
      error: 'Supabase no está configurado. Revisa las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.',
    };
  }

  try {
    const { data, error } = await client.auth.signInWithPassword({
      email: params.email.trim(),
      password: params.password,
    });

    if (error) {
      return { data: null, error: translateAuthError(error) };
    }

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Error al iniciar sesión' };
  }
}

export async function signOutFromSupabase(): Promise<AuthResponse<boolean>> {
  const client = getSupabase();
  if (!client) return { data: true, error: null };

  try {
    const { error } = await client.auth.signOut();
    if (error) {
      return { data: false, error: error.message };
    }
    return { data: true, error: null };
  } catch (err: any) {
    return { data: false, error: err?.message || 'Error al cerrar sesión' };
  }
}

export async function sendPasswordResetEmail(email: string): Promise<AuthResponse<boolean>> {
  const client = getSupabase();
  if (!client) {
    return {
      data: false,
      error: 'Supabase no está configurado. Verifica tus credenciales.',
    };
  }

  try {
    // Determine the redirect URL for password reset return
    const redirectUrl = typeof window !== 'undefined' ? window.location.origin : undefined;

    const { error } = await client.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: redirectUrl,
    });

    if (error) {
      return { data: false, error: translateAuthError(error) };
    }

    return { data: true, error: null };
  } catch (err: any) {
    return { data: false, error: err?.message || 'Error al enviar correo de recuperación' };
  }
}

export async function updateSupabasePassword(newPassword: string): Promise<AuthResponse<boolean>> {
  const client = getSupabase();
  if (!client) {
    return { data: false, error: 'Supabase no está configurado' };
  }

  try {
    const { error } = await client.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { data: false, error: translateAuthError(error) };
    }

    return { data: true, error: null };
  } catch (err: any) {
    return { data: false, error: err?.message || 'Error al actualizar contraseña' };
  }
}

export async function fetchUserProfile(userId: string): Promise<SupabaseProfile | null> {
  const client = getSupabase();
  if (!client || !userId) return null;

  try {
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Error fetching profile from public.profiles:', error.message);
      return null;
    }

    return data as SupabaseProfile;
  } catch (err: any) {
    console.warn('Profiles query failed:', err?.message);
    return null;
  }
}

// Friendly Spanish translations for Supabase Auth errors
export function translateAuthError(error: AuthError): string {
  const msg = error.message.toLowerCase();

  if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
    return 'Correo o contraseña incorrectos. Por favor, verifica tus datos.';
  }
  if (msg.includes('user already registered') || msg.includes('already exists')) {
    return 'Ya existe una cuenta con este correo electrónico. Prueba iniciando sesión o recuperando tu contraseña.';
  }
  if (msg.includes('password should be at least')) {
    return 'La contraseña debe tener al menos 6 caracteres.';
  }
  if (msg.includes('email not confirmed')) {
    return 'Por favor confirma tu correo electrónico antes de iniciar sesión (revisa tu bandeja de entrada o spam).';
  }
  if (msg.includes('rate limit')) {
    return 'Has realizado demasiados intentos en poco tiempo. Por favor, espera unos minutos e inténtalo de nuevo.';
  }
  if (msg.includes('requires a valid email')) {
    return 'Por favor ingresa un correo electrónico válido.';
  }

  return error.message;
}
