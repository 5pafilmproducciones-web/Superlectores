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
