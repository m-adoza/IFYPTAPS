/**
 * ============================================================
 * FILE: js/config.js
 * PURPOSE: Supabase Configuration & Client Initialization
 * MODULE: Configuration
 * DESCRIPTION: Initializes the Supabase client with your project URL and anon key
 * ============================================================
 */

// Your Supabase project URL
const SUPABASE_URL = 'https://ecvvxyavruvkqrinvkax.supabase.co';

// Your Supabase anon public key (safe to use in browser)
const SUPABASE_ANON_KEY = 'sb_publishable__nCK27XLr8-iRcFNT_aTfw_D3hLaOMh';
// Initialize the Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other modules (using global variable)
window.supabaseClient = supabaseClient;
window.SUPABASE_URL = SUPABASE_URL;

console.log('✅ Supabase client initialized.');
