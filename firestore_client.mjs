// firestore_client.mjs
import "dotenv/config";
import admin from "firebase-admin";

let db;

/**
 * Initializes Firestore using Application Default Credentials (recommended).
 * Works great if you set GOOGLE_APPLICATION_CREDENTIALS to a service account JSON file.
 */
export function getDb() {
  if (db) return db;

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  }

  db = admin.firestore();
  return db;
}
