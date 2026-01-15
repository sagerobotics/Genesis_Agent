import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// IMPORTANT: use your web firebaseConfig (from Firebase console)
const firebaseConfig = {
  apiKey: "Go retrieve this from your Firebase console",
  authDomain: "almighty-test.firebaseapp.com",
  projectId: "almighty-test",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const facts = [
  {
    title: "Refund window",
    content: "Refunds are allowed within 30 days of purchase with receipt.",
    tags: ["billing", "refund", "policy"],
    source: "Billing Policy v3",
    isActive: true,
  },
  {
    title: "Support hours",
    content: "Support is available Monday-Friday, 9am-5pm Central Time.",
    tags: ["support", "hours"],
    source: "Support SOP",
    isActive: true,
  },
];

const uploadFacts = async () => {
  for (const fact of facts) {
    await addDoc(collection(db, "facts"), {
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
