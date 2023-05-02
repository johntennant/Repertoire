import {
  getFirestore,
  collection,
  doc,
  getDoc,
  updateDoc,
  getDocs,
  writeBatch,
  setDoc,
} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { handleOpeningButtonClick } from './openingButtons.js';
import { shufflePickString } from './shuffleFromArrayAndStoreHistory.js'; 
import { openURLorPGN } from './handleUrlDrillOrPgnLine.js';
import { flagLastDrill, removeLastFlaggedDrill } from "./flaggedDrillsAddRemove.js";

let lastSelectedOpeningLineObj = null;
const openingsForWhiteContainer = document.getElementById("openings-for-white-container");
const openingsForBlackContainer = document.getElementById("openings-for-black-container");
const flaggedDrillsContainer = document.getElementById("flagged-drills-container");
const flaggedDrillsInteractContainer = document.getElementById("flagged-drills-interact-container");

async function createOpeningButton(openingName, colorKey) {
  const button = document.createElement("button");
  // Use the opening name as the button text, unless it's "FlaggedDrills"
  // In that case, use "Flagged Drills for White" or "Flagged Drills for Black"
  if (openingName === "FlaggedDrills") {
    button.textContent = `Flagged Drills for ${colorKey === "asWhite" ? "White" : "Black"}`;
  } else {
    button.textContent = openingName;
  }

  button.classList.add("opening-button");
  button.addEventListener("click", async () => {
    const uid = getCurrentUserId();
    const fetchedDataResult = await handleOpeningButtonClick(uid, openingName, colorKey);
    // const fetchedDataResult = await handleOpeningButtonClick(uid, openingName);
    const selectedOpeningLines = fetchedDataResult.lines;
    console.log("Selected Opening Lines:", selectedOpeningLines);
    const selectedOpeningUsedIndexes = fetchedDataResult.usedIndexes;

    const shuffleResult = shufflePickString(selectedOpeningUsedIndexes, selectedOpeningLines);
    const selectedOpeningLine = shuffleResult.pickedString;
    console.log("From userDataInteractions.js, Selected Opening Line:", selectedOpeningLine);

    const updatedUsedIndexesArray = shuffleResult.updatedUsedIndexes;
    
    console.log("From userDataInteractions.js, Color Key:", colorKey);

    openURLorPGN(selectedOpeningLine);
    updateOpeningUsedIndexes(uid, openingName, colorKey, updatedUsedIndexesArray);

    // Update the global variable with the selected opening line

    lastSelectedOpeningLineObj = {
      pgn: selectedOpeningLine,
      openingName,
      colorKey,
    };
  });
  return button;
}

const createFlaggedDrillsButton = async (openingName, colorKey) => {
  const flaggedDrillsButton = await createOpeningButton(openingName, colorKey);
  flaggedDrillsButton.classList.add("flagged-drills-button");
  return flaggedDrillsButton;
};

const createButtonsForOpenings = async (openingData, colorKey) => {
  const buttons = [];

  for (const openingName in openingData) {
    if (openingName.endsWith("UsedIndexes")) continue;

    if (openingName === "FlaggedDrills") {
      const flaggedDrillsButton = await createOpeningButton(openingName, colorKey);
      flaggedDrillsButton.classList.add("flagged-drills-button"); // Add a class for styling
      flaggedDrillsContainer.appendChild(flaggedDrillsButton); // Add the button to the DOM
    } else {
      const openingButton = await createOpeningButton(openingName, colorKey);
      if (colorKey === "asWhite") {
        openingsForWhiteContainer.appendChild(openingButton); // Add the button to the DOM
      } else {
        openingsForBlackContainer.appendChild(openingButton); // Add the button to the DOM
      }
    }
    
  }

  return buttons;
};

const processDocSnapshot = async (docSnapshot, colorKey) => {
  if (!docSnapshot.exists()) {
    console.log(`No opening data found for ${colorKey}.`);
    return [];
  }

  console.log("Opening data:", docSnapshot.data());
  const openingData = docSnapshot.data();
  const buttons = await createButtonsForOpenings(openingData, colorKey);
  return buttons;
};

export const getOpeningData = async (uid) => {
  try {
    const db = getFirestore();
    const openingsContainer = document.getElementById("openings-container");
    
    const docRefs = [
      doc(db, "users", uid, "openings", "asWhite"),
      doc(db, "users", uid, "openings", "asBlack"),
    ]; 

    const docSnapshots = await Promise.all(docRefs.map((ref) => getDoc(ref)));
    const colorKeys = ["asWhite", "asBlack"];

    for (const [index, docSnapshot] of docSnapshots.entries()) {
      const buttons = await processDocSnapshot(docSnapshot, colorKeys[index]);
      buttons.forEach((button) => openingsContainer.appendChild(button));
    }


    flaggedDrillsContainer.style.display = "block";

    const flagLastDrillButton = document.createElement("button");
    flagLastDrillButton.textContent = "Flag Last Drill";
    flagLastDrillButton.classList.add("flag-last-drill-button");
    flaggedDrillsInteractContainer.appendChild(flagLastDrillButton);

    const removeLastFlaggedDrillButton = document.createElement("button");
    removeLastFlaggedDrillButton.textContent = "Remove Last Flagged Drill";
    removeLastFlaggedDrillButton.classList.add("remove-last-flagged-drill-button");
    flaggedDrillsInteractContainer.appendChild(removeLastFlaggedDrillButton);

    flagLastDrillButton.addEventListener("click", async () => {
      await flagLastDrill(getCurrentUserId(), lastSelectedOpeningLineObj);
      console.log("Flagged last drill! " + lastSelectedOpeningLineObj);
    });

    removeLastFlaggedDrillButton.addEventListener("click", async () => {
      await removeLastFlaggedDrill(getCurrentUserId(), lastSelectedOpeningLineObj);
    });
  } catch (error) {
    console.error("Error fetching opening data:", error);
  }
}; 


// This updates the used indexes array for the opening that was clicked on.
async function updateOpeningUsedIndexes(uid, openingName, color, updatedUsedIndexesArray) {
  if (color !== 'asWhite' && color !== 'asBlack') {
    console.error('Invalid color. Please provide "asWhite" or "asBlack" as the color argument.');
    return;
  }

  const db = getFirestore();
  const openingRef = doc(db, 'users', uid, 'openings', color);

  try {
    const openingDoc = await getDoc(openingRef);

    if (openingDoc.exists()) {
      const openingData = openingDoc.data();

      if (openingData[openingName]) {
        await updateDoc(openingRef, { [openingName + 'UsedIndexes']: updatedUsedIndexesArray });
        console.log(`Updated used indexes for openingName: ${openingName}, color: ${color}`);
      } else {
        console.error(`Opening name ${openingName} not found in color: ${color}`);
      }
    } else {
      console.error(`Color ${color} not found for uid: ${uid}`);
    }
  } catch (error) {
    console.error('Error updating used indexes:', error);
  }
}


// Get the current user's ID

function getCurrentUserId() {
  const auth = getAuth(); 
  const user = auth.currentUser;

  if (user) {
    console.log(user.uid);
    return user.uid;
  } else {
    console.log("No user is signed in.");
    return null;
  }
}


export function removeAllButtons() {
  const containers = [
    "flagged-drills-container",
    "openings-for-white-container",
    "openings-for-black-container",
    "flagged-drills-interact-container"
  ];

  containers.forEach((containerId) => {
    const container = document.getElementById(containerId);
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  });
}