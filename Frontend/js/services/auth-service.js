/**
 * Authentication Service.
 * Handles Google Login and user session management.
 * @module Services/Auth
 */
import { auth, googleProvider } from './firebase-config.js';
import { signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/**
 * Initiates Google Login flow.
 * @returns {Promise<User>} The authenticated user object.
 */
export async function loginWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log("User signed in:", user);
        return user;
    } catch (error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error("Login error:", errorCode, errorMessage);
        throw error;
    }
}

/**
 * Logs out the current user.
 */
export async function logout() {
    try {
        await signOut(auth);
        console.log("User signed out");
        localStorage.removeItem('isLoggedIn'); // Clear local legacy flag
    } catch (error) {
        console.error("Logout error:", error);
        throw error;
    }
}

/**
 * Subscribes to auth state changes.
 * @param {Function} callback - Function to call when auth state changes.
 * @returns {Function} Unsubscribe function.
 */
export function subscribeToAuthChanges(callback) {
    return onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            localStorage.setItem('isLoggedIn', 'true'); // Keep legacy flag for now
        } else {
            // User is signed out
            // Only clear if NOT in demo mode
            if (!localStorage.getItem('isDemoMode')) {
                localStorage.removeItem('isLoggedIn');
            }
        }
        callback(user);
    });
}
