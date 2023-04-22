import { getFirestore, collection, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";

export const getUserData = async (uid) => {
  try {
    const db = getFirestore();
    const userRef = doc(collection(db, "users"), uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      console.log("User data:", userDoc.data());
      return userDoc.data();
    } else {
      console.log("No such user found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};
