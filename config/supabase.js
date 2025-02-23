// This is the Supabase module
const supa = require('@supabase/supabase-js');

const supaUrl = process.env.SUPABASE_URL;
const supaAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = supa.createClient(supaUrl, supaAnonKey); 

module.exports = supabase;