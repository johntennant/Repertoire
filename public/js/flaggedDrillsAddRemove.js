import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
import { showTemporaryMessage } from "./uiFeedback.js";
import { refreshFlaggedDrillsButtons } from "./userDataInteractions.js";
import { storeOpeningDataInLocalStorage, getOpeningDataFromLocalStorage } from './localStorageReadWrite.js';

export const getFlaggedDrillsFromLocalStorage = (colorKey) => {
  const openingData = getOpeningDataFromLocalStorage();
  return openingData && openingData[colorKey] ? openingData[colorKey].FlaggedDrills : [];
};

export const addDrillToFlaggedDrills = (colorKey, pgn) => {
  const openingData = getOpeningDataFromLocalStorage();
  if (!openingData || !openingData[colorKey]) return;

  // Add the new pgn to the flagged drills array
  openingData[colorKey].FlaggedDrills = openingData[colorKey].FlaggedDrills || [];
  openingData[colorKey].FlaggedDrills.push(pgn);

  // Save the updated opening data back to local storage
  storeOpeningDataInLocalStorage(openingData);
};

export const updateFlaggedDrillsInFirestore = async (uid, colorKey, pgn) => {
  const db = getFirestore();
  const flaggedDrillsRef = doc(db, "users", uid, "openings", colorKey);

  // Update the document in Firestore by adding the pgn to the FlaggedDrills array
  await updateDoc(flaggedDrillsRef, {
    FlaggedDrills: arrayUnion(pgn),
  });
};

export const flagLastDrill = async (uid) => {
  // Retrieve the data from local storage
  const lastSelectedOpeningLineObjString = localStorage.getItem('lastSelectedOpeningLineObj');
  
  // Check if the data exists in local storage
  if (lastSelectedOpeningLineObjString) {
    const lastSelectedOpeningLineObj = JSON.parse(lastSelectedOpeningLineObjString);
    const { openingName, colorKey, pgn } = lastSelectedOpeningLineObj;

    // Update flagged drills in local storage
    addDrillToFlaggedDrills(colorKey, pgn);

    // Update flagged drills in Firestore
    await updateFlaggedDrillsInFirestore(uid, colorKey, pgn);

    const color = colorKey === "asWhite" ? "White" : "Black";
    console.log(`Drill from '${openingName}' as '${colorKey}' added to FlaggedDrills.`);
    showTemporaryMessage(`Last drill from ${openingName} was added to Flagged Lines for ${color}.`);
  } else {
    console.error("No lastSelectedOpeningLineObj found in local storage.");
  }
  refreshFlaggedDrillsButtons();
};




export const removeDrillFromLocalFlaggedDrills = (colorKey, pgn, flaggedDrillsUsedIndexes) => {
  const openingData = getOpeningDataFromLocalStorage();
  if (!openingData || !openingData[colorKey]) return;

  // Get the FlaggedDrills array
  const flaggedDrills = openingData[colorKey].FlaggedDrills || [];

  // Find the index of the drill to be removed
  const drillIndex = flaggedDrills.indexOf(pgn);
  if (drillIndex !== -1) {
    // Remove the drill from the FlaggedDrills array
    flaggedDrills.splice(drillIndex, 1);
  }

  // Update the FlaggedDrillsUsedIndexes array
  openingData[colorKey].FlaggedDrillsUsedIndexes = flaggedDrillsUsedIndexes;

  // Save the updated opening data back to local storage
  storeOpeningDataInLocalStorage(openingData);

  // use the buttonID to find the button element
  updateFlaggedDrillButtonText(colorKey, flaggedDrillsUsedIndexes, flaggedDrills);

};


export const updateFlaggedDrillsAndIndexesInFirestore = async (uid, colorKey, flaggedDrills, flaggedDrillsUsedIndexes) => {
  const db = getFirestore();
  const flaggedDrillsRef = doc(db, "users", uid, "openings", colorKey);

  // Update the FlaggedDrills and FlaggedDrillsUsedIndexes arrays in Firestore
  await updateDoc(flaggedDrillsRef, {
    FlaggedDrills: flaggedDrills,
    FlaggedDrillsUsedIndexes: flaggedDrillsUsedIndexes,
  });
};

export const removeLastFlaggedDrill = async (uid) => {
  // Retrieve the data from local storage
  const lastSelectedOpeningLineObjString = localStorage.getItem('lastSelectedOpeningLineObj');
  
  // Check if the data exists in local storage
  if (lastSelectedOpeningLineObjString) {
    const lastSelectedOpeningLineObj = JSON.parse(lastSelectedOpeningLineObjString);
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

      // Update flagged drills in local storage
      removeDrillFromLocalFlaggedDrills(colorKey, pgn, flaggedDrillsUsedIndexes);

      // Update the FlaggedDrills and FlaggedDrillsUsedIndexes arrays in Firestore
      await updateFlaggedDrillsAndIndexesInFirestore(uid, colorKey, flaggedDrills, flaggedDrillsUsedIndexes);

      console.log("Last flagged drill removed.");
      showTemporaryMessage("Last flagged line removed.");
    } else {
      console.log("No matching drill found in FlaggedDrills.");
      showTemporaryMessage("No matching drill found in FlaggedDrills.");
    }
  } else {
    console.error("No lastSelectedOpeningLineObj found in local storage.");
  }
  // refreshFlaggedDrillsButtons();
};


function updateFlaggedDrillButtonText(colorKey, flaggedDrillsUsedIndexes, flaggedDrills) {
  const buttonID = `FlaggedDrills-${colorKey}`;

  // If the button exists, update the button text
  const button = document.querySelector(`#${buttonID}`);
  if (button) {
    const numberOfUsedIndexes = flaggedDrillsUsedIndexes.length;
    // console.log(numberOfUsedIndexes);
    button.textContent = `Flagged Lines for ${colorKey === "asWhite" ? "White" : "Black"} [${flaggedDrills.length}]`;
  } else {
    console.error(`Button '${buttonID}' not found.`);
  }
}

export function checkFlaggedDrillsButtons() {
  const asWhiteButton = document.querySelector("#FlaggedDrills-asWhite");
  const asBlackButton = document.querySelector("#FlaggedDrills-asBlack");

  // If either button is missing, force reload the page
  if (!asWhiteButton || !asBlackButton) {
    console.log("FlaggedDrillsButtons not found, reloading the page.");
    location.reload();
  } else {
    console.log("FlaggedDrillsButtons found."); 
  }
}
