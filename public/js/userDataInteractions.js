import {
  getFirestore,
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { handleOpeningButtonClick, fetchOpeningData } from './openingButtons.js';
import { shufflePickString } from './shuffleFromArrayAndStoreHistory.js'; 
import { openURLorPGN } from './handleUrlDrillOrPgnLine.js';
import { flagLastDrill, removeLastFlaggedDrill } from "./flaggedDrillsAddRemove.js";

let lastSelectedOpeningLineObj = null;
const openingsForWhiteContainer = document.getElementById("openings-for-white-container");
const openingsForBlackContainer = document.getElementById("openings-for-black-container");
const flaggedDrillsContainer = document.getElementById("flagged-drills-container");
const flaggedDrillsInteractContainer = document.getElementById("flagged-drills-interact-container");

export function testFunction() {
  const flaggedDrillData_asWhite = JSON.parse(
    localStorage.getItem("flaggedDrillData_asWhite")
  );
  const flaggedDrillData_asBlack = JSON.parse(
    localStorage.getItem("flaggedDrillData_asBlack")
  );

  // console.log(flaggedDrillData_asBlack);
  // console.log(flaggedDrillData_asWhite);
  const selectedFlaggedDrillsColor = Math.random() < 0.5 ? flaggedDrillData_asWhite : flaggedDrillData_asBlack;
  const testData = selectedFlaggedDrillsColor

  handleButtonClick(selectedFlaggedDrillsColor.openingName, selectedFlaggedDrillsColor.colorKey);

  console.log(testData);
}

window.testFunction = testFunction;

// export async function practiceNewDrill() {
//   const flaggedDrillData_asWhite = JSON.parse(
//     localStorage.getItem("flaggedDrillData_asWhite")
//   );
//   const flaggedDrillData_asBlack = JSON.parse(
//     localStorage.getItem("flaggedDrillData_asBlack")
//   );
//   const selectedFlaggedDrillsColor = Math.random() < 0.5 ? flaggedDrillData_asWhite : flaggedDrillData_asBlack;

//   handleButtonClick(selectedFlaggedDrillsColor.openingName, selectedFlaggedDrillsColor.colorKey);
//   console.log(selectedFlaggedDrillsColor);
// }

export async function practiceNewDrill() {
  const flaggedDrillData_asWhite = JSON.parse(
    localStorage.getItem("flaggedDrillData_asWhite")
  );
  const flaggedDrillData_asBlack = JSON.parse(
    localStorage.getItem("flaggedDrillData_asBlack")
  );
  const lastSelectedColor = localStorage.getItem("lastSelectedColor") || "black"; // defaults to "black" if not set before
  let selectedFlaggedDrillsColor;

  if(lastSelectedColor === "white") {
    selectedFlaggedDrillsColor = flaggedDrillData_asBlack;
    localStorage.setItem("lastSelectedColor", "black");
  } else {
    selectedFlaggedDrillsColor = flaggedDrillData_asWhite;
    localStorage.setItem("lastSelectedColor", "white");
  }

  handleButtonClick(selectedFlaggedDrillsColor.openingName, selectedFlaggedDrillsColor.colorKey);
  console.log(selectedFlaggedDrillsColor);
}


async function createOpeningButton(openingName, colorKey, openingData) {
  const button = document.createElement("button");
  
  button.classList.add("opening-button", "btn-primary", colorKey);

  if (openingName === "FlaggedDrills") {
    button.textContent = `Flagged Lines for ${colorKey === "asWhite" ? "White" : "Black"} ${openingData.length}`;
  } else {
    button.textContent = `${openingName} ${openingData.length}`;
    console.log("From userDataInteractions.js, openingName:", openingName);
    console.log("From userDataInteractions.js, openingData:", [openingName + 'UsedIndexes']);
  }

  button.addEventListener("click", () => handleButtonClick(openingName, colorKey));

  // Save to localStorage if it's a flagged drill button
  if (openingName === "FlaggedDrills") {
    // Note: We can't store DOM elements (like buttons) directly in localStorage as it only supports strings.
    // But you can store the other related data and recreate the button later when you need it.

    const flaggedDrillData = {
      openingName: openingName,
      colorKey: colorKey
    };

    localStorage.setItem('flaggedDrillData_' + colorKey, JSON.stringify(flaggedDrillData));
  }

  return button;
}


export async function handleButtonClick(openingName, colorKey) {
  const uid = getCurrentUserId();
  const fetchedDataResult = await handleOpeningButtonClick(uid, openingName, colorKey);
  const selectedOpeningLines = fetchedDataResult.lines;
  console.log("Selected Opening Lines:", selectedOpeningLines);
  const selectedOpeningUsedIndexes = fetchedDataResult.usedIndexes;

  const shuffleResult = shufflePickString(selectedOpeningUsedIndexes, selectedOpeningLines);
  const selectedOpeningLine = shuffleResult.pickedString;
  console.log("From userDataInteractions.js, Selected Opening Line:", selectedOpeningLine);
  
  const updatedUsedIndexesArray = shuffleResult.updatedUsedIndexes;

  console.log("From userDataInteractions.js, Color Key:", colorKey);

  // Update the global variable with the selected opening line
  lastSelectedOpeningLineObj = {
    pgn: selectedOpeningLine,
    openingName,
    colorKey,
  };
  localStorage.setItem('lastSelectedOpeningLineObj', JSON.stringify(lastSelectedOpeningLineObj));

  // Await the Firestore update and then open the URL
  await updateOpeningUsedIndexes(uid, openingName, colorKey, updatedUsedIndexesArray);
  openURLorPGN(selectedOpeningLine, colorKey);
}


export async function refreshFlaggedDrillsButtons() {
  // We first obtain a reference to the HTML container which holds the flagged drills buttons.
  const flaggedDrillsContainer = document.getElementById('flagged-drills-container');

  // Next, we clear all existing child elements (buttons in this case) from this container.
  // This is done by repeatedly removing the first child until there are no children left.
  while (flaggedDrillsContainer.firstChild) {
    flaggedDrillsContainer.removeChild(flaggedDrillsContainer.firstChild);
  }

  // We define an array of the color keys, each representing a distinct color.
  const colorKeys = ["asWhite", "asBlack"];

  // We also define the opening names for which we want to refresh buttons.
  const openingNames = ['FlaggedDrills'];

  // We obtain the user ID from the 'getCurrentUserId' function.
  // This function must be defined elsewhere in your code.
  const uid = getCurrentUserId();

  // We loop through both color keys and opening names and fetch data for each combination.
  for (const colorKey of colorKeys) {
    for (const openingName of openingNames) {
      // The function 'fetchOpeningData' is called with the user ID, opening name, and color key as parameters.
      // The data fetched from this function includes the opening lines and used indexes.
      const fetchedDataResult = await fetchOpeningData(uid, openingName, colorKey);

      // Now we recreate the buttons for each opening using the 'createOpeningButton' function.
      // The newly created button is then appended to the container.
      const newButton = await createOpeningButton(openingName, colorKey, fetchedDataResult.lines);
      newButton.classList.add("opening-button", "btn-primary", colorKey);
      flaggedDrillsContainer.appendChild(newButton);
    }
  }
}



const createButtonsForOpenings = async (openingData, colorKey) => {
  const buttons = [];

  for (const openingName in openingData) { 
    if (openingName.endsWith("UsedIndexes")) continue;
     if (openingName === "FlaggedDrills") {
      const flaggedDrillsButton = await createOpeningButton(openingName, colorKey, openingData[openingName]);
      flaggedDrillsButton.classList.add("flagged-drills-button"); // Add a class for styling
      flaggedDrillsContainer.appendChild(flaggedDrillsButton); // Add the button to the DOM
    } else {
      const openingButton = await createOpeningButton(openingName, colorKey, openingData[openingName]);
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

export const fetchUserData = async (uid) => {
  try {
    const db = getFirestore();

    const docRefs = [
      doc(db, "users", uid, "openings", "asWhite"),
      doc(db, "users", uid, "openings", "asBlack"),
    ];

    const docSnapshots = await Promise.all(docRefs.map((ref) => getDoc(ref)));
    const colorKeys = ["asWhite", "asBlack"];
    const openingData = {};

    for (const [index, docSnapshot] of docSnapshots.entries()) {
      openingData[colorKeys[index]] = docSnapshot.data();
    }

    return openingData;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};


export const buildUsersOpeningsUI = async (uid) => {
  try {
    const db = getFirestore();
    // const openingsContainer = document.getElementById("openings-container");

    const openingData = await fetchUserData(uid);
    const colorKeys = ["asWhite", "asBlack"];

    for (const colorKey of colorKeys) {
      const customDocSnapshot = {
        exists: () => true,
        data: () => openingData[colorKey],
      };

      const buttons = await processDocSnapshot(customDocSnapshot, colorKey);
      // buttons.forEach((button) => openingsContainer.appendChild(button));
    }

    flaggedDrillsContainer.style.display = "block";

    const flagLastDrillButton = document.getElementById("flag-last-drill-button");
    const removeLastFlaggedDrillButton = document.getElementById("remove-last-flagged-drill-btn");

    // After building the UI, check the lastSelectedOpeningLineObj
  const lastSelectedOpeningLineObjString = localStorage.getItem('lastSelectedOpeningLineObj');
  if (lastSelectedOpeningLineObjString) {
    const lastSelectedOpeningLineObj = JSON.parse(lastSelectedOpeningLineObjString);
    const removeLastFlaggedDrillButton = document.getElementById("remove-last-flagged-drill-btn");

    if (lastSelectedOpeningLineObj.openingName === "FlaggedDrills") {
      removeLastFlaggedDrillButton.classList.remove("hidden");
      flagLastDrillButton.classList.add("hidden");
    } else {
      removeLastFlaggedDrillButton.classList.add("hidden");
      flagLastDrillButton.classList.remove("hidden");
    }}

    flagLastDrillButton.addEventListener("click", async () => {
      await flagLastDrill(getCurrentUserId());
      console.log("Flagged last drill! " + lastSelectedOpeningLineObj);
    });

    removeLastFlaggedDrillButton.addEventListener("click", async () => {
      await removeLastFlaggedDrill(getCurrentUserId());
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

export function getCurrentUserId() {
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

export function loadNewFlaggedDrill(colorKey) {
  const flaggedDrillsContainer = document.getElementById('flagged-drills-container');
  const button = flaggedDrillsContainer.querySelector(`button.opening-button.${colorKey}`);

  if (button) {
    button.click();
  } else {
    console.error(`No button found for colorKey ${colorKey}`);
  }
}
