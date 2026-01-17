import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// IMPORTANT: use your web firebaseConfig (from Firebase console)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "almighty-test.firebaseapp.com",
  projectId: "almighty-test",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const facts = [
  {
    name: "Felix McClarty",
    relationship: "Grandfather",
    birth_place: "Marianna, Mississippi, USA",
    birth: ["May", "22", "1894"],
    source: "4-McClarty Geneology",
    isActive: true,
  },
  {
    name: "Eugene McClarty",
    relationship: "Uncle",
    birth_place: "Marianna, Mississippi, USA",
    birth: ["February", "27", "1891"],
    source: "4-McClarty Geneology",
    isActive: true,
  },
];

const uploadFacts = async () => {
  for (const fact of facts) {
    await addDoc(collection(db, "McClarty_FamilyFacts"), {
      ...fact,
      updatedAt: serverTimestamp(),
    });
  }
};

try {
  await uploadFacts();
  console.log("Data uploaded.");
} catch (error) {
  console.error("Upload failed.", error);
  process.exitCode = 1;
}
