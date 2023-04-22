
const getUserData = async (uid) => {
  try {
    const db = firebase.firestore();
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
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
