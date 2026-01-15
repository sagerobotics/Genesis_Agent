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
  apiKey: "AIzaSyDXS6Lftgfl9-rzA0ljIj0YCSpF5_fp4FI",
  authDomain: "almighty-test.firebaseapp.com",
  projectId: "almighty-test",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Update settings: adjust these for your collection and match field/value.
const targetCollection = "facts";
const matchField = "title";
const matchValue = "Support hours";

// Fields to update on matching documents.
const updates = {
  isActive: true,
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
