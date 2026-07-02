/**
 * ============================================================
 * FILE: js/validation.js
 * PURPOSE: Client-side form validation helpers
 * MODULE: Utilities
 * DEPENDENCIES: None
 * DESCRIPTION:
 *   - Provides reusable validation functions for forms.
 * ============================================================
 */

/**
 * Validate email format.
 * @param {string} email - Email to validate.
 * @returns {boolean}
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Validate password strength (at least 8 chars, includes uppercase, lowercase, number, special).
 * @param {string} password - Password to check.
 * @returns {object} - { valid: boolean, message: string }
 */
function isStrongPassword(password) {
    if (password.length < 8) {
        return { valid: false, message: 'Password must be at least 8 characters long.' };
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one uppercase letter.' };
    }
    if (!/[a-z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one lowercase letter.' };
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one number.' };
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one special character.' };
    }
    return { valid: true, message: 'Password is strong.' };
}

/**
 * Validate required fields.
 * @param {object} fields - Object with field names and values.
 * @returns {object} - { valid: boolean, errors: object }
 */
function validateRequired(fields) {
    const errors = {};
    let valid = true;
    for (const [key, value] of Object.entries(fields)) {
        if (!value || value.trim() === '') {
            errors[key] = 'This field is required.';
            valid = false;
        }
    }
    return { valid, errors };
}

/**
 * Validate phone number (simple Nigerian format).
 * @param {string} phone - Phone number.
 * @returns {boolean}
 */
function isValidPhone(phone) {
    // Accept +234, 080, 080X, etc.
    const re = /^(\+234|0)[7-9][0-9]{9}$/;
    return re.test(phone);
}

// Export globally
window.isValidEmail = isValidEmail;
window.isStrongPassword = isStrongPassword;
window.validateRequired = validateRequired;
window.isValidPhone = isValidPhone;

console.log('Validation module loaded.');