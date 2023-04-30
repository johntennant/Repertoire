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

//FlaggedDrills still only works for one color. 
async function createOpeningButton(openingName, openingData, colorKey = null) {
  const button = document.createElement("button");
  button.textContent = openingName;
  button.classList.add("opening-button");
  button.addEventListener("click", async () => {
    const uid = getCurrentUserId();
    const colorKey = fetchedDataResult.colorKey;
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


export const getOpeningData = async (uid) => {
  try {
    const db = getFirestore();
    const openingsContainer = document.getElementById("openings-container");

    // Fetch data from both "asWhite" and "asBlack" documents
    const docRefs = [
      doc(db, "users", uid, "openings", "asWhite"),
      doc(db, "users", uid, "openings", "asBlack"),
    ];

    const docSnapshots = await Promise.all(docRefs.map((ref) => getDoc(ref)));

    let flaggedDrillsAdded = false;
    let nextColorKey = "asWhite"; // Initialize nextColorKey

    for (const [index, docSnapshot] of docSnapshots.entries()) {
      if (docSnapshot.exists()) {
        console.log("Opening data:", docSnapshot.data());

        // Show the openings container (which contains the buttons for each opening).
        openingsContainer.style.display = "block";
        const openingData = docSnapshot.data();

        for (const openingName in openingData) {
          // Loop through the openings
          if (openingName.endsWith("UsedIndexes")) continue; // Skip the UsedIndexes arrays
          if (openingName === "FlaggedDrills") {
            if (!flaggedDrillsAdded) {
              const colorKey = nextColorKey; // Set the current colorKey
              const flaggedDrillsButton = await createOpeningButton(
                openingName,
                openingData,
                colorKey
              );
              flaggedDrillsButton.classList.add("flagged-drills-button"); // Add a class for styling
              openingsContainer.appendChild(flaggedDrillsButton); // Add the button to the DOM
              flaggedDrillsAdded = true;

              // Toggle the next colorKey between "asWhite" and "asBlack"
              nextColorKey = colorKey === "asWhite" ? "asBlack" : "asWhite";
            }
            continue; // Skip the FlaggedDrills arrays
          }
          const openingButton = await createOpeningButton(
            openingName,
            openingData
          );
          openingsContainer.appendChild(openingButton); // Add the button to the DOM
        }
      } else {
        console.log(
          `No opening data found for ${index === 0 ? "asWhite" : "asBlack"}.`
        );
      }
    }

    const flagLastDrillButton = document.createElement("button");
    flagLastDrillButton.textContent = "Flag Last Drill";
    flagLastDrillButton.classList.add("flag-last-drill-button");
    openingsContainer.appendChild(flagLastDrillButton);

    const removeLastFlaggedDrillButton = document.createElement("button");
    removeLastFlaggedDrillButton.textContent = "Remove Last Flagged Drill";
    removeLastFlaggedDrillButton.classList.add(
      "remove-last-flagged-drill-button"
    );
    openingsContainer.appendChild(removeLastFlaggedDrillButton);

    // Add event listener for "Flag Last Drill" button
    flagLastDrillButton.addEventListener("click", async () => {
      await flagLastDrill(getCurrentUserId(), lastSelectedOpeningLineObj);
      console.log("Flagged last drill! "+lastSelectedOpeningLineObj);
    });

    // Add event listener for "Remove Last Flagged Drill" button
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


