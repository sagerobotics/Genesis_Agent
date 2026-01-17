// Info_retriever.mjs
import { getDb } from "./firestore_client.mjs";
const COLLECTION_NAME = "McClarty_FamilyFacts";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);

const isDirectRun =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename);

  const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "almighty-test.firebaseapp.com",
  projectId: "almighty-test",
};

/**
 * Simple retrieval:
 * - returns any facts in the collection
 * - limit results (keep context tight)
 */
export async function info_retriever({ limit = 500 } = {}) {
  const db = getDb();

  const q = db.collection(COLLECTION_NAME);

  const snap = await q.limit(limit).get();

  const results = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  /*console.log("info_retriever results:", results); */
  return results;
}


if (isDirectRun) {
  const argLimit = Number.parseInt(process.argv[2] ?? "5", 10);
  const limit = Number.isFinite(argLimit) && argLimit > 0 ? argLimit : 5;

  info_retriever({ limit })
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("info_retriever error:", err);
      process.exit(1);
    });
}
