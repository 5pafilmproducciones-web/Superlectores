import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy-initialized Supabase Admin Client for backend operations
let supabaseAdminInstance: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  const supabaseUrl = 
    process.env.SUPABASE_URL || 
    process.env.NEXT_PUBLIC_SUPABASE_URL || 
    process.env.VITE_SUPABASE_URL;

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  if (!supabaseAdminInstance) {
    supabaseAdminInstance = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return supabaseAdminInstance;
}
