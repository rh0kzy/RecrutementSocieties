import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL || '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!url || !serviceKey) {
  console.warn('Supabase not configured — SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing from env');
}

export const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

export default supabase;
