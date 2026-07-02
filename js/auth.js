/**
 * ============================================================
 * FILE: js/auth.js
 * PURPOSE: Authentication & Session Management
 * MODULE: Authentication
 * DEPENDENCIES: js/config.js (supabaseClient)
 * DESCRIPTION:
 *   - Provides login, registration, logout, password reset, and session handling.
 *   - Retrieves user role and redirects to appropriate dashboard.
 *   - Includes helper functions for authentication state and user info.
 * ============================================================
 */

// Ensure the Supabase client is available
if (typeof window.supabaseClient === 'undefined') {
    console.error('Supabase client not found. Ensure js/config.js is loaded first.');
}

const supabase = window.supabaseClient;

/**
 * Log in a user with email and password.
 * @param {string} email - User's email address.
 * @param {string} password - User's password.
 * @param {boolean} rememberMe - Whether to persist session.
 * @returns {Promise<{user: object, error: object}>}
 */
async function loginUser(email, password, rememberMe = false) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        if (error) throw error;

        // After successful login, fetch the user's role from the database
        const user = data.user;
        const role = await getUserRole(user.id);

        // Store user info including role in session (localStorage or sessionStorage)
        const sessionData = {
            user: user,
            role: role,
            loggedInAt: new Date().toISOString(),
        };
        if (rememberMe) {
            localStorage.setItem('intelliverify_session', JSON.stringify(sessionData));
        } else {
            sessionStorage.setItem('intelliverify_session', JSON.stringify(sessionData));
        }

        return { user, role, error: null };
    } catch (error) {
        console.error('Login error:', error.message);
        return { user: null, role: null, error: error };
    }
}

/**
 * Register a new student account.
 * @param {object} userData - Registration form data.
 * @returns {Promise<{user: object, error: object}>}
 */
async function registerUser(userData) {
    try {
        // 1. Create auth account
        const { data, error } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
            options: {
                data: {
                    first_name: userData.firstName,
                    middle_name: userData.middleName || '',
                    last_name: userData.lastName,
                    phone: userData.phone || '',
                    role: 'student', // default role for new registrations
                },
            },
        });
        if (error) throw error;

        const user = data.user;

        // 2. Insert student profile into 'students' table (if needed)
        // This assumes you have a table 'students' with appropriate columns.
        // For now, we'll use a database function or direct insert.
        // We'll insert after auth success.
        const { error: profileError } = await supabase
            .from('students')
            .insert([
                {
                    user_id: user.id,
                    matric_number: userData.matricNumber,
                    faculty_id: userData.facultyId || null,
                    department_id: userData.departmentId || null,
                    level: userData.level || null,
                    academic_session: userData.academicSession || null,
                    registration_date: new Date().toISOString(),
                },
            ]);

        if (profileError) {
            // If profile insert fails, we should clean up the auth user (optional)
            console.error('Profile creation failed:', profileError);
            // Optionally delete auth user or handle gracefully
            throw profileError;
        }

        return { user, error: null };
    } catch (error) {
        console.error('Registration error:', error.message);
        return { user: null, error: error };
    }
}

/**
 * Log out the current user.
 * @returns {Promise<{error: object}>}
 */
async function logoutUser() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        // Clear local session storage
        localStorage.removeItem('intelliverify_session');
        sessionStorage.removeItem('intelliverify_session');

        // Redirect to login page
        window.location.href = '../login.html';
        return { error: null };
    } catch (error) {
        console.error('Logout error:', error.message);
        return { error: error };
    }
}

/**
 * Send password reset email.
 * @param {string} email - User's email address.
 * @returns {Promise<{error: object}>}
 */
async function resetPassword(email) {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/reset-password.html',
        });
        if (error) throw error;
        return { error: null };
    } catch (error) {
        console.error('Password reset error:', error.message);
        return { error: error };
    }
}

/**
 * Update password (for reset flow).
 * @param {string} newPassword - New password.
 * @returns {Promise<{error: object}>}
 */
async function updatePassword(newPassword) {
    try {
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });
        if (error) throw error;
        return { error: null };
    } catch (error) {
        console.error('Update password error:', error.message);
        return { error: error };
    }
}

/**
 * Get the current authenticated user's role from the database.
 * @param {string} userId - The user's UUID.
 * @returns {Promise<string>} - Role string: 'student', 'supervisor', 'admin', 'super_admin'
 */
async function getUserRole(userId) {
    try {
        // First check super_administrators table
        const { data: superAdmin, error: err1 } = await supabase
            .from('super_administrators')
            .select('user_id')
            .eq('user_id', userId)
            .maybeSingle();
        if (superAdmin) return 'super_admin';

        // Then check administrators
        const { data: admin, error: err2 } = await supabase
            .from('administrators')
            .select('user_id')
            .eq('user_id', userId)
            .maybeSingle();
        if (admin) return 'admin';

        // Then supervisors
        const { data: supervisor, error: err3 } = await supabase
            .from('supervisors')
            .select('user_id')
            .eq('user_id', userId)
            .maybeSingle();
        if (supervisor) return 'supervisor';

        // Default to student (everyone else)
        return 'student';
    } catch (error) {
        console.error('Error fetching role:', error.message);
        return 'student'; // fallback
    }
}

/**
 * Get the current authenticated user (from session or Supabase).
 * @returns {Promise<{user: object, role: string, error: object}>}
 */
async function getCurrentUser() {
    try {
        // Check session storage first
        let sessionData = sessionStorage.getItem('intelliverify_session');
        if (!sessionData) {
            sessionData = localStorage.getItem('intelliverify_session');
        }
        if (sessionData) {
            const parsed = JSON.parse(sessionData);
            // Validate session freshness (optional)
            return { user: parsed.user, role: parsed.role, error: null };
        }

        // If no session, try to get from Supabase
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!data.session) {
            return { user: null, role: null, error: null };
        }

        const user = data.session.user;
        const role = await getUserRole(user.id);
        // Store for future
        const storeData = { user, role, loggedInAt: new Date().toISOString() };
        sessionStorage.setItem('intelliverify_session', JSON.stringify(storeData));
        return { user, role, error: null };
    } catch (error) {
        console.error('Get current user error:', error.message);
        return { user: null, role: null, error: error };
    }
}

/**
 * Redirect user based on role.
 * @param {string} role - User's role.
 * @param {string} currentPage - Current page path (to avoid redirect loops).
 */
function redirectToDashboard(role, currentPage = '') {
    const roleMap = {
        student: '../student/dashboard.html',
        supervisor: '../supervisor/dashboard.html',
        admin: '../admin/dashboard.html',
        super_admin: '../superadmin/dashboard.html',
    };
    const target = roleMap[role] || '../login.html';
    // Avoid redirect if already on target
    if (currentPage && currentPage.includes(target)) return;
    window.location.href = target;
}

/**
 * Protect a page: if not authenticated, redirect to login.
 * Also checks role and ensures user is allowed on the current page.
 * @param {string} requiredRole - Optional: require a specific role.
 * @param {string} currentPage - Current page path for redirect logic.
 */
async function protectPage(requiredRole = null, currentPage = '') {
    const { user, role, error } = await getCurrentUser();
    if (error || !user) {
        // Not authenticated, redirect to login
        window.location.href = '../login.html';
        return;
    }
    // If a specific role is required, check
    if (requiredRole && role !== requiredRole) {
        // Redirect to appropriate dashboard based on actual role
        redirectToDashboard(role, currentPage);
        return;
    }
    // User is authenticated and has correct role
    return { user, role };
}

// Export functions globally (for use in HTML pages)
window.loginUser = loginUser;
window.registerUser = registerUser;
window.logoutUser = logoutUser;
window.resetPassword = resetPassword;
window.updatePassword = updatePassword;
window.getCurrentUser = getCurrentUser;
window.redirectToDashboard = redirectToDashboard;
window.protectPage = protectPage;
window.getUserRole = getUserRole;

console.log('Authentication module loaded.');