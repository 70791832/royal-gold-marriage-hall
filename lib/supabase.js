import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rojhezcjxinioxpyvagq.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_Tcn7pvGMLpRwAJhAmZtWBw_5Il6zYYn';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);