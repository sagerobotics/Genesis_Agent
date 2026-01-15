// facts_retriever.mjs
import { getDb } from "./firestore_client.mjs";

/**
 * Simple starter retrieval:
 * - only active facts
 * - optional tag filter
 * - limit results (keep context tight)
 */
export async function fetchFacts({ tag = null, limit = 5 } = {}) {
  const db = getDb();

  let q = db.collection("facts").where("isActive", "==", true);

  if (tag) {
    q = q.where("tags", "array-contains", tag);
  }

  const snap = await q.limit(limit).get();

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

/**
 * Lightweight keyword approach:
 * pulls a small set, then filters locally by keyword matches in title/content/tags.
 * Good enough to start; upgrade to embeddings later.
 */
export async function fetchFactsForQuestion(question, limit = 5) {
  const db = getDb();

  // Get a manageable pool of facts (adjust if you have thousands)
  const snap = await db
    .collection("facts")
    .where("isActive", "==", true)
    .limit(200)
    .get();

  const q = question.toLowerCase();

  const scored = snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .map((f) => {
      const hay = `${f.title ?? ""} ${f.content ?? ""} ${(f.tags ?? []).join(" ")}`.toLowerCase();
      // crude score: count of word hits
      let score = 0;
      for (const word of q.split(/\W+/).filter(Boolean)) {
        if (word.length >= 4 && hay.includes(word)) score += 1;
      }
      return { fact: f, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.fact);

  return scored;
}
