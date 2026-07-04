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
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjdnZ4eWF2cnV2a3FyaW52a2F4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5OTc2NzQsImV4cCI6MjA5ODU3MzY3NH0.LEqGKXr1R0PrOOFhr_KePjugFVg77ruEj_DJVx9CDQw';
// Initialize the Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other modules (using global variable)
window.supabaseClient = supabaseClient;
window.SUPABASE_URL = SUPABASE_URL;

console.log('✅ Supabase client initialized.');
