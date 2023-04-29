import { getFirestore, doc, getDoc, collection } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";


// Retrieve the array of opening lines from the opening data.
// Also retrieve the array of used indexes from the opening data.
// Return an object containing the opening lines, used indexes, and color key.

async function fetchOpeningData(uid, openingName) {
  try {
    const db = getFirestore();
    const openingsRef = collection(db, "users", uid, "openings");
    const asWhiteDocRef = doc(openingsRef, "asWhite");

    const asWhiteDocSnapshot = await getDoc(asWhiteDocRef);
    const asWhiteData = asWhiteDocSnapshot.data();

    console.log("asWhiteData:", asWhiteData);
    console.log("openingName:", openingName);

    const openingLinesAsWhite = asWhiteData[openingName] || [];
    const usedIndexesAsWhite = asWhiteData[openingName + "UsedIndexes"] || [];

    console.log("openingLinesAsWhite:", openingLinesAsWhite);
    console.log("usedIndexesAsWhite:", usedIndexesAsWhite);

    return {
      lines: openingLinesAsWhite,
      usedIndexes: usedIndexesAsWhite,
    };
  } catch (error) {
    console.error("Error fetching opening data:", error);
    return null;
  }
}



export async function handleOpeningButtonClick(uid, openingName) {
  // Fetch the opening data using the helper function
  const openingData = await fetchOpeningData(uid, openingName);
  console.log("Fetched opening data:", openingData);

  // Log the opening data for debugging purposes
  console.log("Opening data for", openingName, ":", openingData);

  // Extract the selected opening lines and used indexes
  const selectedOpeningLines = openingData.lines;
  const selectedOpeningUsedIndexes = openingData.usedIndexes;
  const colorKey = "asWhite";

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
