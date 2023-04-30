import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";

export const flagLastDrill = async (uid, lastSelectedOpeningLineObj) => {
  const { openingName, colorKey, pgn } = lastSelectedOpeningLineObj;

  const db = getFirestore();
  const flaggedDrillsRef = doc(db, "users", uid, "openings", colorKey);

  // Update the document in Firestore by adding the pgn to the FlaggedDrills array
  await updateDoc(flaggedDrillsRef, {
    FlaggedDrills: arrayUnion(pgn),
  });

  console.log(`Drill from '${openingName}' as '${colorKey}' added to FlaggedDrills.`);
};


export const removeLastFlaggedDrill = async (uid, lastSelectedOpeningLineObj) => {
  const { colorKey, pgn } = lastSelectedOpeningLineObj;

  // Access the Firestore database
  const db = getFirestore();
  const flaggedDrillsRef = doc(db, "users", uid, "openings", colorKey);

  // Get the document containing the FlaggedDrills and FlaggedDrillsUsedIndexes arrays
  const flaggedDrillsDocSnapshot = await getDoc(flaggedDrillsRef);
  const flaggedDrillsData = flaggedDrillsDocSnapshot.data();
  const flaggedDrills = flaggedDrillsData.FlaggedDrills || [];
  const flaggedDrillsUsedIndexes = flaggedDrillsData.FlaggedDrillsUsedIndexes || [];

  // Find the index of the last selected drill in the FlaggedDrills array
  const drillIndex = flaggedDrills.indexOf(pgn);
  if (drillIndex !== -1) {
    // Remove the drill from the FlaggedDrills array
    flaggedDrills.splice(drillIndex, 1);

    // Remove the corresponding index from the FlaggedDrillsUsedIndexes array
    flaggedDrillsUsedIndexes.pop();

    // Update the FlaggedDrills and FlaggedDrillsUsedIndexes arrays in Firestore
    await updateDoc(flaggedDrillsRef, {
      FlaggedDrills: flaggedDrills,
      FlaggedDrillsUsedIndexes: flaggedDrillsUsedIndexes,
    });

    console.log("Last flagged drill removed.");
  } else {
    console.log("No matching drill found in FlaggedDrills.");
  }
};

