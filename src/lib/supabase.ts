import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Database {
  public: {
    Tables: {
      flowcharts: {
        Row: {
          id: string;
          nodes: any;
          edges: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nodes: any;
          edges: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nodes?: any;
          edges?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
