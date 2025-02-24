// This is the Supabase module
const supa = require('@supabase/supabase-js');

const supaUrl = process.env.SUPABASE_URL; //This will grab the url from the supabase created containing the data
const supaAnonKey = process.env.SUPABASE_ANON_KEY; //this is the key from the supabase created containing the data

const supabase = supa.createClient(supaUrl, supaAnonKey); //create a supabase instance

module.exports = supabase;