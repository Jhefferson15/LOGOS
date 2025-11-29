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

    // TEMPORARY: Save to LocalStorage instead of Firestore
    try {
        // Prepare data for serialization (convert Sets to Arrays)
        const dataToSave = { ...gameState };

        // Deep copy studyProgress to handle Sets
        if (dataToSave.studyProgress) {
            dataToSave.studyProgress = {};
            for (const [key, value] of Object.entries(gameState.studyProgress)) {
                dataToSave.studyProgress[key] = {
                    ...value,
                    pagesViewed: Array.from(value.pagesViewed || [])
                };
            }
        }

        localStorage.setItem(`gameProgress_${userId}`, JSON.stringify(dataToSave));
        console.log("Game progress saved to LocalStorage.");
    } catch (error) {
        console.error("Error saving game progress to LocalStorage:", error);
    }
}

/**
 * Loads the user's game progress.
 * @param {string} userId - The user's ID.
 * @returns {Promise<Object|null>} The game state object or null if not found.
 */
export async function loadGameProgress(userId) {
    if (!userId) return null;

    // TEMPORARY: Load from LocalStorage instead of Firestore
    try {
        const savedData = localStorage.getItem(`gameProgress_${userId}`);
        if (savedData) {
            const parsedData = JSON.parse(savedData);

            // Restore Sets in studyProgress
            if (parsedData.studyProgress) {
                for (const key in parsedData.studyProgress) {
                    if (parsedData.studyProgress[key].pagesViewed) {
                        parsedData.studyProgress[key].pagesViewed = new Set(parsedData.studyProgress[key].pagesViewed);
                    }
                }
            }

            console.log("Game progress loaded from LocalStorage.");
            return parsedData;
        } else {
            console.log("No saved game found in LocalStorage.");
            return null;
        }
    } catch (error) {
        console.error("Error loading game progress from LocalStorage:", error);
        return null;
    }
}
