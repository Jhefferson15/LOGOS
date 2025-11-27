/**
 * Database Service.
 * Handles saving and loading user data and game progress to Firestore.
 * @module Services/Database
 */
import { db } from './firebase-config.js';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/**
 * Saves or updates the user's basic profile information.
 * @param {User} user - The Firebase User object.
 */
export async function saveUserProfile(user) {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userData = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        lastLogin: serverTimestamp()
    };

    try {
        // setDoc with merge: true will update existing fields or create the document if it doesn't exist
        await setDoc(userRef, userData, { merge: true });
        console.log("User profile saved.");
    } catch (error) {
        console.error("Error saving user profile:", error);
    }
}

/**
 * Saves the current game state.
 * @param {string} userId - The user's ID.
 * @param {Object} gameState - The game state object to save.
 */
export async function saveGameProgress(userId, gameState) {
    if (!userId || !gameState) return;

    const gameRef = doc(db, "users", userId, "gameData", "progress");

    // Create a clean copy of the game state to avoid circular references or non-serializable data
    const dataToSave = {
        xp: gameState.xp || 0,
        xpMax: gameState.xpMax || 100,
        level: gameState.level || 1,
        scrolls: gameState.scrolls || 0,
        books: gameState.books || 0,
        trophies: gameState.trophies || 0,
        timers: gameState.timers || {},
        chestSlots: gameState.chestSlots || [],
        lastSaved: serverTimestamp()
    };

    try {
        await setDoc(gameRef, dataToSave);
        console.log("Game progress saved.");
    } catch (error) {
        console.error("Error saving game progress:", error);
    }
}

/**
 * Loads the user's game progress.
 * @param {string} userId - The user's ID.
 * @returns {Promise<Object|null>} The game state object or null if not found.
 */
export async function loadGameProgress(userId) {
    if (!userId) return null;

    const gameRef = doc(db, "users", userId, "gameData", "progress");

    try {
        const docSnap = await getDoc(gameRef);
        if (docSnap.exists()) {
            console.log("Game progress loaded.");
            return docSnap.data();
        } else {
            console.log("No saved game found.");
            return null;
        }
    } catch (error) {
        console.error("Error loading game progress:", error);
        return null;
    }
}
