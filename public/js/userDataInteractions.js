import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { handleOpeningButtonClick, fetchOpeningData } from './openingButtons.js';
import { shufflePickString } from './shuffleFromArrayAndStoreHistory.js'; 
import { openURLorPGN } from './handleUrlDrillOrPgnLine.js';
import { flagLastDrill, removeLastFlaggedDrill } from "./flaggedDrillsAddRemove.js";
import { storeOpeningDataInLocalStorage, compareServerData, getOpeningDataFromLocalStorage } from './localStorageReadWrite.js';

let lastSelectedOpeningLineObj = null;
const openingsForWhiteContainer = document.getElementById("openings-for-white-container");
const openingsForBlackContainer = document.getElementById("openings-for-black-container");
const flaggedDrillsContainer = document.getElementById("flagged-drills-container");
let cUid = null;
// const flaggedDrillsInteractContainer = document.getElementById("flagged-drills-interact-container");

export function testFunction() {

  // console.log(testData);
}

window.testFunction = testFunction;

// Dynamic button that changes text based on the last selected opening line 
// only visible when the last line selected was not a flagged drill
lastSelectedOpeningLineObj = JSON.parse(localStorage.getItem('lastSelectedOpeningLineObj')) || {};

const dynamicPracticeLineButton = document.getElementById('dynamic-practice-line-button');
const loadNewFlaggedDrillButton = document.getElementById('loadNewFlaggedDrillButton');

if (dynamicPracticeLineButton) { // Check if the dynamicPracticeLineButton exists
  if (lastSelectedOpeningLineObj.openingName) {
    dynamicPracticeLineButton.textContent = `Practice a new line from ${lastSelectedOpeningLineObj.openingName}`;

    // Hide or show buttons based on the openingName
    if (lastSelectedOpeningLineObj.openingName === "FlaggedDrills") {
      dynamicPracticeLineButton.style.display = "none"; // Hide dynamicPracticeLineButton
      if (loadNewFlaggedDrillButton) loadNewFlaggedDrillButton.style.display = "block"; // Show loadNewFlaggedDrillButton
    } else {
      dynamicPracticeLineButton.style.display = "block"; // Show dynamicPracticeLineButton
      if (loadNewFlaggedDrillButton) loadNewFlaggedDrillButton.style.display = "none"; // Hide loadNewFlaggedDrillButton
    }
  } else {
    dynamicPracticeLineButton.textContent = `Practice a new line`; // Default text
    dynamicPracticeLineButton.style.display = "block"; // Show dynamicPracticeLineButton
    if (loadNewFlaggedDrillButton) loadNewFlaggedDrillButton.style.display = "none"; // Hide loadNewFlaggedDrillButton
  }
}

// Add event listener to the dynamicPracticeLineButton
if (dynamicPracticeLineButton) { // Check if the button exists
  dynamicPracticeLineButton.addEventListener('click', function() {
    handleButtonClick(lastSelectedOpeningLineObj.openingName, lastSelectedOpeningLineObj.colorKey);
  });
}


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

async function createOpeningButton(openingName, colorKey, openingData, openingDataUsedIndexes) {
  // Unique ID based on color and openingName
  let buttonId = `${openingName}-${colorKey}`;

  // Check if a button with the unique ID already exists
  if (openingName === "FlaggedDrills" && document.getElementById(buttonId)) {
    console.log(`Button for ${openingName} as ${colorKey} already exists.`);
    return; // exit the function
  }

  const button = document.createElement("button");

  button.classList.add("opening-button", "btn-primary", colorKey);

  if (openingName === "FlaggedDrills") {
    const numberOfUsedIndexes = openingDataUsedIndexes.length;
    // console.log(numberOfUsedIndexes);
    // button.textContent = `Flagged Lines for ${colorKey === "asWhite" ? "White" : "Black"} ${numberOfUsedIndexes}/${openingData.length}`; // Show the number of used indexes
    button.textContent = `Flagged Lines for ${colorKey === "asWhite" ? "White" : "Black"} [${openingData.length}]`; // Don't show the number of used indexes

    // Assign the unique ID to the button
    button.id = buttonId;
  } else {
    const numberOfUsedIndexes = openingDataUsedIndexes.length;
    // console.log(numberOfUsedIndexes);
    // button.textContent = `${openingName} ${numberOfUsedIndexes}/${openingData.length}`; // Show the number of used indexes
    button.textContent = `${openingName} [${openingData.length}]`; // Don't show the number of used indexes
    // console.log("From userDataInteractions.js, openingName:", openingName);
    // console.log("From userDataInteractions.js, openingData:", [openingName + 'UsedIndexes']);
  }

  button.addEventListener("click", () => handleButtonClick(openingName, colorKey));

  // Save to localStorage if it's a flagged drill button
  if (openingName === "FlaggedDrills") {
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
  const flaggedDrillsContainer = document.getElementById('flagged-drills-container');

  // clear all existing child elements
  while (flaggedDrillsContainer.firstChild) {
    flaggedDrillsContainer.removeChild(flaggedDrillsContainer.firstChild);
  }

  // We define an array of the color keys, each representing a distinct color.
  const colorKeys = ["asWhite", "asBlack"];

  // We also define the opening names for which we want to refresh buttons.
  const openingNames = ['FlaggedDrills'];

  // Get the opening data from local storage
  const openingData = getOpeningDataFromLocalStorage();

  // loop through both color keys and opening names and use data for each combination from local storage.
  for (const colorKey of colorKeys) {
    for (const openingName of openingNames) {
      // The data used from local storage includes the opening lines and used indexes.
      const lines = openingData && openingData[colorKey] ? openingData[colorKey][openingName] : [];
      const usedIndexes = openingData && openingData[colorKey] ? openingData[colorKey].FlaggedDrillsUsedIndexes : [];

      // recreate the buttons for each opening and append to the container.
      const newButton = await createOpeningButton(openingName, colorKey, lines, usedIndexes);
      newButton.classList.add("opening-button", "btn-primary", colorKey);
      flaggedDrillsContainer.appendChild(newButton);
    }
  }
}



const createButtonsForOpenings = async (openingData, colorKey) => {
  const buttons = [];

  for (const openingName in openingData) {
    if (openingName.endsWith("UsedIndexes")) continue;

    // Check if [openingName]+UsedIndexes is present, if not create it as an empty array
    if (!openingData.hasOwnProperty(openingName + 'UsedIndexes')) {
      openingData[openingName + 'UsedIndexes'] = [];
    }

    if (openingName === "FlaggedDrills") {
      const flaggedDrillsButton = await createOpeningButton(openingName, colorKey, openingData[openingName], openingData[openingName + 'UsedIndexes']);
      flaggedDrillsButton.classList.add("flagged-drills-button"); // Add a class for styling
      flaggedDrillsContainer.appendChild(flaggedDrillsButton); // Add the button to the DOM
    } else {
      const openingButton = await createOpeningButton(openingName, colorKey, openingData[openingName], openingData[openingName + 'UsedIndexes']);
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

  // console.log("Opening data:", docSnapshot.data());
  const openingData = docSnapshot.data();
  const buttons = await createButtonsForOpenings(openingData, colorKey);
  return buttons;
};

export const fetchUserData = async (uid) => {
  try {
    const db = getFirestore();

    // Fetching only the openings for now
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

    // Now, fetch the user document to get/check the maxPracticeDepth
    const userDocSnapshot = await getDoc(doc(db, "users", uid));

    if (!userDocSnapshot.exists()) {
      // If user document doesn't exist, create one with maxPracticeDepth set to 100
      await setDoc(doc(db, "users", uid), { maxPracticeDepth: 100 });
      openingData["maxPracticeDepth"] = 100;
    } else if (!userDocSnapshot.data().maxPracticeDepth) {
      // If maxPracticeDepth doesn't exist, set it to 100 in Firestore
      await updateDoc(doc(db, "users", uid), { maxPracticeDepth: 100 });
      openingData["maxPracticeDepth"] = 100;
    } else {
      openingData["maxPracticeDepth"] = userDocSnapshot.data().maxPracticeDepth;
    }

    // Store the fetched openingData in localStorage
    storeOpeningDataInLocalStorage(openingData);

    return openingData;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};




export const buildUsersOpeningsUI = async (uid) => {
  try {
    // Retrieve openingData from localStorage
    const openingData = getOpeningDataFromLocalStorage();

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

      // if (lastSelectedOpeningLineObj.openingName === "FlaggedDrills") {
      //   removeLastFlaggedDrillButton.classList.remove("hidden");
      //   flagLastDrillButton.classList.add("hidden");
      // } else {
      //   removeLastFlaggedDrillButton.classList.add("hidden");
      //   flagLastDrillButton.classList.remove("hidden");
      // }
      if (lastSelectedOpeningLineObj.openingName === "FlaggedDrills") {
        if (removeLastFlaggedDrillButton) {
          removeLastFlaggedDrillButton.classList.remove("hidden");
        }
        if (flagLastDrillButton) {
          flagLastDrillButton.classList.add("hidden");
        }
      } else {
        if (removeLastFlaggedDrillButton) {
          removeLastFlaggedDrillButton.classList.add("hidden");
        }
        if (flagLastDrillButton) {
          flagLastDrillButton.classList.remove("hidden");
        }
      }
      
      
    }

    if (flagLastDrillButton) {
      flagLastDrillButton.addEventListener("click", async () => {
        await flagLastDrill(getCurrentUserId());
        console.log("Flagged last drill! " + lastSelectedOpeningLineObj);
      });
    }
    
    if (removeLastFlaggedDrillButton) {
      removeLastFlaggedDrillButton.addEventListener("click", async () => {
        await removeLastFlaggedDrill(getCurrentUserId());
      });
    }
    
  } catch (error) {
    console.error("Error fetching opening data:", error);
  }
  compareServerData(uid);
};


async function updateOpeningUsedIndexes(uid, openingName, color, updatedUsedIndexesArray) {
  if (color !== 'asWhite' && color !== 'asBlack') {
    console.error('Invalid color. Please provide "asWhite" or "asBlack" as the color argument.');
    return;
  }

  // Update used indexes in localStorage
  updateUsedIndexesInLocalStorage(openingName, color, updatedUsedIndexesArray);

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

function updateUsedIndexesInLocalStorage(openingName, color, updatedUsedIndexesArray) {
  const openingData = getOpeningDataFromLocalStorage();
  if (!openingData || !openingData[color]) return;

  // Update the used indexes array in the opening data
  if (openingData[color][openingName]) {
    openingData[color][openingName + 'UsedIndexes'] = updatedUsedIndexesArray;
  }

  // Save the updated opening data back to local storage
  storeOpeningDataInLocalStorage(openingData);
}



// Get the current user's ID

export function getCurrentUserId() {
  const auth = getAuth(); 
  const user = auth.currentUser;

  if (user) {
    // console.log(user.uid);
    cUid = user.uid;
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

