import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create client even if vars are missing (will fail at query time with better error)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
