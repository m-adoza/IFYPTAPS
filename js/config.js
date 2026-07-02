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
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';

// Initialize the Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other modules
// (Using global variable for simplicity; can be adapted to ES modules if needed)
window.supabaseClient = supabaseClient;

// Also export constants for other scripts to reference
window.SUPABASE_URL = SUPABASE_URL;

console.log('Supabase client initialized.');