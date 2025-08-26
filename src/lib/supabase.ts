import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for Medfly Medical Platform
export interface Database {
  public: {
    Tables: {
      years: {
        Row: {
          id: string;
          year_number: number;
          year_name: string;
          description: string;
          color_code: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          year_number: number;
          year_name: string;
          description?: string;
          color_code?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          year_number?: number;
          year_name?: string;
          description?: string;
          color_code?: string;
          created_at?: string;
        };
      };
      lecturers: {
        Row: {
          id: string;
          name: string;
          title: string;
          specialization: string;
          email: string | null;
          phone: string | null;
          office_location: string | null;
          bio: string;
          profile_image: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          title?: string;
          specialization: string;
          email?: string | null;
          phone?: string | null;
          office_location?: string | null;
          bio?: string;
          profile_image?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          title?: string;
          specialization?: string;
          email?: string | null;
          phone?: string | null;
          office_location?: string | null;
          bio?: string;
          profile_image?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      units: {
        Row: {
          id: string;
          unit_name: string;
          unit_code: string;
          year_id: string;
          lecturer_id: string | null;
          description: string;
          credit_hours: number;
          semester: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          unit_name: string;
          unit_code: string;
          year_id: string;
          lecturer_id?: string | null;
          description?: string;
          credit_hours?: number;
          semester?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          unit_name?: string;
          unit_code?: string;
          year_id?: string;
          lecturer_id?: string | null;
          description?: string;
          credit_hours?: number;
          semester?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          tag_name: string;
          description: string;
          color_code: string;
          parent_tag_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tag_name: string;
          description?: string;
          color_code?: string;
          parent_tag_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          tag_name?: string;
          description?: string;
          color_code?: string;
          parent_tag_id?: string | null;
          created_at?: string;
        };
      };
      notes: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string;
          unit_id: string;
          year_id: string;
          lecturer_id: string | null;
          featured_image: string | null;
          file_attachments: any;
          difficulty_level: string;
          estimated_read_time: number;
          is_published: boolean;
          is_featured: boolean;
          view_count: number;
          download_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string;
          unit_id: string;
          year_id: string;
          lecturer_id?: string | null;
          featured_image?: string | null;
          file_attachments?: any;
          difficulty_level?: string;
          estimated_read_time?: number;
          is_published?: boolean;
          is_featured?: boolean;
          view_count?: number;
          download_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          excerpt?: string;
          unit_id?: string;
          year_id?: string;
          lecturer_id?: string | null;
          featured_image?: string | null;
          file_attachments?: any;
          difficulty_level?: string;
          estimated_read_time?: number;
          is_published?: boolean;
          is_featured?: boolean;
          view_count?: number;
          download_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      note_tags: {
        Row: {
          id: string;
          note_id: string;
          tag_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          note_id: string;
          tag_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          note_id?: string;
          tag_id?: string;
          created_at?: string;
        };
      };
      user_bookmarks: {
        Row: {
          id: string;
          user_id: string;
          note_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          note_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          note_id?: string;
          created_at?: string;
        };
      };
      note_views: {
        Row: {
          id: string;
          note_id: string;
          user_id: string | null;
          ip_address: string | null;
          user_agent: string | null;
          viewed_at: string;
        };
        Insert: {
          id?: string;
          note_id: string;
          user_id?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          viewed_at?: string;
        };
        Update: {
          id?: string;
          note_id?: string;
          user_id?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          viewed_at?: string;
        };
      };
    };
  };
}

// Helper types for the application
export type Year = Database['public']['Tables']['years']['Row'];
export type Lecturer = Database['public']['Tables']['lecturers']['Row'];
export type Unit = Database['public']['Tables']['units']['Row'] & {
  year?: Year;
  lecturer?: Lecturer;
};
export type Tag = Database['public']['Tables']['tags']['Row'];
export type Note = Database['public']['Tables']['notes']['Row'] & {
  unit?: Unit;
  year?: Year;
  lecturer?: Lecturer;
  tags?: Tag[];
};