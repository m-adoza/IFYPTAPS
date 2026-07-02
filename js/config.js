/**
 * ============================================================
 * FILE: js/config.js
 * PURPOSE: Supabase Configuration & Client Initialization
 * MODULE: Configuration
 * DEPENDENCIES: Supabase SDK (loaded via CDN)
 * DESCRIPTION: 
 *   - Initializes the Supabase client with project URL and anon key.
 *   - Exports the client for use across all modules.
 *   - All sensitive keys should be replaced with actual values.
 * ============================================================
 */

// Supabase project URL (from blueprint)
const SUPABASE_URL = 'https://ecvvxyavruvkqrinvkax.supabase.co';

// Supabase anonymous key (placeholder – replace with your actual key)
// IMPORTANT: This key is safe to use in client-side code (it has limited permissions).
// Never expose the service_role key in client-side code.
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjdnZ4eWF2cnV2a3FyaW52a2F4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5OTc2NzQsImV4cCI6MjA5ODU3MzY3NH0.LEqGKXr1R0PrOOFhr_KePjugFVg77ruEj_DJVx9CDQw';

// Initialize the Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other modules
// (Using global variable for simplicity; can be adapted to ES modules if needed)
window.supabaseClient = supabaseClient;

// Also export constants for other scripts to reference
window.SUPABASE_URL = SUPABASE_URL;

console.log('Supabase client initialized.');
