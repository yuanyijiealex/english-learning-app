export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          avatar_url: string | null
          total_points: number
          level: number
          streak_days: number
          subscription_status: 'free' | 'premium'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          username: string
          avatar_url?: string | null
          total_points?: number
          level?: number
          streak_days?: number
          subscription_status?: 'free' | 'premium'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          avatar_url?: string | null
          total_points?: number
          level?: number
          streak_days?: number
          subscription_status?: 'free' | 'premium'
          created_at?: string
          updated_at?: string
        }
      }
      videos: {
        Row: {
          id: string
          title: string
          url: string
          duration: number
          difficulty: number
          category: string
          accent: string
          thumbnail: string | null
          transcript_en: Json
          transcript_cn: Json
          checkpoints: Json
          ai_analysis: Json | null
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          url: string
          duration: number
          difficulty: number
          category: string
          accent: string
          thumbnail?: string | null
          transcript_en: Json
          transcript_cn: Json
          checkpoints: Json
          ai_analysis?: Json | null
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          url?: string
          duration?: number
          difficulty?: number
          category?: string
          accent?: string
          thumbnail?: string | null
          transcript_en?: Json
          transcript_cn?: Json
          checkpoints?: Json
          ai_analysis?: Json | null
          view_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      learning_records: {
        Row: {
          id: string
          user_id: string
          video_id: string
          progress: number
          watch_duration: number
          points_earned: number
          checkpoints_passed: Json
          words_collected: Json
          notes: string | null
          completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          video_id: string
          progress?: number
          watch_duration?: number
          points_earned?: number
          checkpoints_passed?: Json
          words_collected?: Json
          notes?: string | null
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          video_id?: string
          progress?: number
          watch_duration?: number
          points_earned?: number
          checkpoints_passed?: Json
          words_collected?: Json
          notes?: string | null
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      collections: {
        Row: {
          id: string
          user_id: string
          video_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          video_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          video_id?: string
          created_at?: string
        }
      }
      word_bank: {
        Row: {
          id: string
          user_id: string
          word: string
          translation: string
          example_sentence: string | null
          source_video_id: string | null
          review_count: number
          last_reviewed: string | null
          mastery_level: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          word: string
          translation: string
          example_sentence?: string | null
          source_video_id?: string | null
          review_count?: number
          last_reviewed?: string | null
          mastery_level?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          word?: string
          translation?: string
          example_sentence?: string | null
          source_video_id?: string | null
          review_count?: number
          last_reviewed?: string | null
          mastery_level?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}