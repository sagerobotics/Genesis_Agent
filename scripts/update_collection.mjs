import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

// IMPORTANT: use your web firebaseConfig (from Firebase console)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "almighty-test.firebaseapp.com",
  projectId: "almighty-test",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Update settings: adjust these for your collection and match field/value.
const targetCollection = "McClarty_FamilyFacts";
const matchField = "name";
const matchValue = "Eugene McClarty";

// Fields to update on matching documents.
const updates = {
  isActive: true,
  militaryService: "World War I",
  updatedAt: serverTimestamp(),
};

const updateMatchingDocs = async () => {
  const q = query(
    collection(db, targetCollection),
    where(matchField, "==", matchValue)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    console.log("No matching documents found.");
    return;
  }

  let updatedCount = 0;
  for (const docSnap of snapshot.docs) {
    await updateDoc(docSnap.ref, updates);
    updatedCount += 1;
  }

  console.log(`Updated ${updatedCount} document(s).`);
};

try {
  await updateMatchingDocs();
} catch (error) {
  console.error("Update failed.", error);
  process.exitCode = 1;
}
