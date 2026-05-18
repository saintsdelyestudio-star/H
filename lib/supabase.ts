/**
 * Supabase client for Delyé admin
 *
 * Required environment variables:
 *   NEXT_PUBLIC_SUPABASE_URL  — Supabase project URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY — Supabase anon key
 *   SUPABASE_SERVICE_ROLE_KEY — Service role key (server-only)
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Browser client (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side admin client (uses service role key — never expose to client)
export function createAdminClient() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase admin credentials')
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Database types (extend as tables are created)
export type Database = {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          category: string
          priority: string
          status: string
          assignee: string | null
          due_date: string | null
          created_at: string
          updated_at: string
          tags: string[] | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category: string
          priority: string
          status: string
          assignee?: string | null
          due_date?: string | null
          created_at?: string
          updated_at?: string
          tags?: string[] | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category?: string
          priority?: string
          status?: string
          assignee?: string | null
          due_date?: string | null
          updated_at?: string
          tags?: string[] | null
        }
      }
      moodboard_items: {
        Row: {
          id: string
          type: string
          category: string
          title: string | null
          content: string
          notes: string | null
          tags: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          type: string
          category: string
          title?: string | null
          content: string
          notes?: string | null
          tags?: string[] | null
          created_at?: string
        }
        Update: {
          type?: string
          category?: string
          title?: string | null
          content?: string
          notes?: string | null
          tags?: string[] | null
        }
      }
    }
  }
}
