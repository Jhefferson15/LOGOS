const admin = require('firebase-admin');
const path = require('path');

// Try to load service account from a file if path is provided in env
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

try {
    if (serviceAccountPath) {
        // If path is relative, resolve it
        const resolvedPath = path.resolve(serviceAccountPath);
        const serviceAccount = require(resolvedPath);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log("Firebase initialized with service account.");
    } else {
        // Fallback to default credentials (useful for cloud deployment)
        admin.initializeApp();
        console.log("Firebase initialized with default credentials.");
    }
} catch (error) {
    console.warn("Failed to initialize Firebase Admin:", error.message);
    console.warn("Backend will run but database features will fail.");
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
