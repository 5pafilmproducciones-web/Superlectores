import type { User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js';

export interface CoreRecord {
  id: string;
  title: string;
  category: string;
  status: 'activo' | 'pendiente' | 'completado';
  createdAt: string;
  level?: number;
  gemsReward?: number;
  authorOrTarget?: string;
}

export type TabType = 'dashboard' | 'operations' | 'records' | 'settings' | 'auth';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  isTrue: boolean;
  explanation: string;
}

export interface Story {
  id: string;
  title: string;
  category: string;
  level: 1 | 2 | 3;
  levelName: 'Nivel 1 (7 años)' | 'Nivel 2 (8-9 años)' | 'Nivel 3 (10 años)';
  badge: string;
  emoji: string;
  coverImage?: string;
  summary: string;
  text: string;
  wordCount: number;
  rewardGems: number;
  rewardPoints: number;
  questions: QuizQuestion[];
  writingChallenge: {
    prompt: string;
    keywordsRequired: string[];
    hint: string;
  };
}

export interface ChildProfile {
  name: string;
  age: number;
  avatar: string;
  level: number;
  gems: number;
  score: number;
  storiesCompletedCount: number;
  audioAccuracyAverage: number;
  streakDays: number;
  activeGamePass: string | null;
}

export interface ReadingEvaluation {
  id: string;
  storyId: string;
  storyTitle: string;
  studentName: string;
  completedAt: string;
  voiceAccuracy: number; // 0 - 100%
  mispronouncedWords: string[];
  quizScore: number; // e.g. 3/3
  totalQuestions: number;
  writingResponse?: string;
  writingApproved: boolean;
  gemsEarned: number;
  pointsEarned: number;
  status: 'completado' | 'pendiente' | 'activo';
}

export type GameId = 
  | 'race' 
  | 'puzzle' 
  | 'paint' 
  | 'maze' 
  | 'memory' 
  | 'space' 
  | 'words'
  | 'runner'
  | 'river'
  | 'moles'
  | 'piano';

export interface MiniGameDefinition {
  id: GameId;
  name: string;
  genre: string;
  gemCost: number;
  durationSeconds: number;
  emoji: string;
  description: string;
  colorScheme: string;
}

export type AuthMode = 'login' | 'register' | 'recovery' | 'update-password';
export type { SupabaseUser, SupabaseSession };

export interface SupabaseProfile {
  id: string;
  email?: string;
  full_name?: string;
  child_name?: string;
  avatar_url?: string;
  role?: 'student' | 'parent' | 'teacher' | 'admin';
  created_at?: string;
  updated_at?: string;
}

// ----------------------------------------------------
// MODELO DE INVENTARIO Y TRAZABILIDAD (SUPABASE)
// ----------------------------------------------------
export interface Category {
  id: string;
  user_id: string;
  name: string;
  description?: string | null;
  color?: string;
  created_at?: string;
}

export interface Product {
  id: string;
  user_id: string;
  sku?: string | null;
  name: string;
  description?: string | null;
  category_id?: string | null;
  category?: Category | null;
  unit: string;
  current_stock: number;
  min_stock: number;
  unit_price: number;
  location?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export type MovementType = 'entrada' | 'salida' | 'ajuste';

export interface InventoryMovement {
  id: string;
  user_id: string;
  product_id: string;
  product?: {
    name: string;
    sku?: string | null;
    unit: string;
  } | null;
  movement_type: MovementType;
  quantity: number;
  previous_stock: number;
  new_stock: number;
  reason: string;
  reference_code?: string | null;
  unit_cost?: number;
  created_at: string;
}

export interface MovementInput {
  productId: string;
  movementType: MovementType;
  quantity: number;
  reason: string;
  referenceCode?: string;
  unitCost?: number;
}

