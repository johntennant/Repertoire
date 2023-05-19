import { getFirestore, doc, getDoc, collection } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";


// Retrieve the array of opening lines from the opening data.
// Also retrieve the array of used indexes from the opening data.
// Return an object containing the opening lines, used indexes, and color key.

export async function fetchOpeningData(uid, openingName, colorKey) {
  try {
    const db = getFirestore();
    const openingsRef = collection(db, "users", uid, "openings");
    const docRef = doc(openingsRef, colorKey);

    const docSnapshot = await getDoc(docRef);

    const openingData = docSnapshot.data() || {};

    const openingLines = openingData[openingName] || [];
    const usedIndexes = openingData[openingName + "UsedIndexes"] || [];

    console.log("Opening Lines:", openingLines);
    console.log("Used Indexes:", usedIndexes);

    return {
      lines: openingLines,
      usedIndexes: usedIndexes,
      colorKey: colorKey,
    };
  } catch (error) {
    console.error("Error fetching opening data:", error);
    return null;
  }
}


export async function handleOpeningButtonClick(uid, openingName, colorKey) {
  // Fetch the opening data using the helper function
  const openingData = await fetchOpeningData(uid, openingName, colorKey);
  console.log("Fetched opening data:", openingData);

  // Log the opening data for debugging purposes
  console.log("Opening data for", openingName, ":", openingData);

  // Extract the selected opening lines, used indexes, and color key
  const selectedOpeningLines = openingData.lines;
  const selectedOpeningUsedIndexes = openingData.usedIndexes;

  // Log the selected opening lines, used indexes, and color key for debugging purposes
  console.log("Selected Opening Lines:", selectedOpeningLines);
  console.log("Selected Opening Used Indexes:", selectedOpeningUsedIndexes);
  console.log("Color Key:", colorKey);

  // Return an object containing the selected opening lines, used indexes, and color key
  return {
    lines: selectedOpeningLines,
    usedIndexes: selectedOpeningUsedIndexes,
    colorKey: colorKey,
  };
}
