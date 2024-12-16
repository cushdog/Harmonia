export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      journal_entries: {
        Row: {
          id: number
          user_id: string
          content: string
          created_at: string
        }
        Insert: {
          user_id: string
          content: string
          created_at?: string
        }
        Update: {
          user_id?: string
          content?: string
          created_at?: string
        }
      }
      medications: {
        Row: {
          id: string
          user_id: string
          name: string
          dosage: string | null
          frequency: string
          time_of_day: string[]
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          name: string
          dosage?: string
          frequency: string
          time_of_day: string[]
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          name?: string
          dosage?: string
          frequency?: string
          time_of_day?: string[]
          notes?: string
          created_at?: string
          updated_at?: string
        }
      }
      medication_logs: {
        Row: {
          id: string
          medication_id: string
          user_id: string
          taken_at: string
          scheduled_time: string
        }
        Insert: {
          medication_id: string
          user_id: string
          taken_at?: string
          scheduled_time: string
        }
        Update: {
          medication_id?: string
          user_id?: string
          taken_at?: string
          scheduled_time?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {
      medication_frequency: 'once_daily' | 'twice_daily' | 'three_times_daily' | 'four_times_daily' | 'every_other_day' | 'weekly' | 'as_needed'
    }
  }
}