// firestore_client.mjs
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
    });
  }

  db = admin.firestore();
  return db;
}
