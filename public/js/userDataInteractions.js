import { getFirestore, collection, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { handleOpeningButtonClick } from './openingButtons.js';
import { shufflePickString } from './shuffleFromArrayAndStoreHistory.js'; 
import { openURLorPGN } from './handleUrlDrillOrPgnLine.js';

// Is needed anymore? (see below)
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

// Creates a button for each opening in the user's openings collection
// and registers a click event listener for the button
// The click event listener calls the handleOpeningButtonClick function
// with the opening data and returns the selected opening line
// and the updates the used indexes array.

function createOpeningButton(openingName, openingData) {
  const button = document.createElement("button");
  button.textContent = openingName;
  button.classList.add("opening-button");
  button.addEventListener("click", () => {
    // Call the handleOpeningButtonClick function with the opening data
    const fetchedDataResult = handleOpeningButtonClick(openingName, openingData[openingName]);
    const selectedOpeningLines = fetchedDataResult.lines;
    // console.log("Selected Opening Lines:", selectedOpeningLines);
    const selectedOpeningUsedIndexes = fetchedDataResult.usedIndexes;
    const shuffleResult = shufflePickString(selectedOpeningUsedIndexes, selectedOpeningLines);
    const selectedOpeningLine = shuffleResult.pickedString;
    console.log("From userDataInteractions.js, Selected Opening Line:", selectedOpeningLine);
    const updatedUsedIndexesArray = shuffleResult.updatedUsedIndexes;
    const colorKey = fetchedDataResult.colorKey;
    console.log("From userDataInteractions.js, Color Key:", colorKey);
    const openingID = 'openingID';
    openURLorPGN(selectedOpeningLine);
    const uid = getCurrentUserId();
    updateOpeningUsedIndexes(uid, openingID, openingName, colorKey, updatedUsedIndexesArray);
  });
  return button;
}

// When a user clicks on an opening button, the opening data is retrieved
// and a button is created for each opening in the opening data.

// Too many nested loops.  Can we simplify this?

export const getOpeningData = async (uid, openingID) => {
  try {
    const db = getFirestore();
    const docRef = doc(db, "users", uid, "openings", openingID);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      console.log("Opening data:", docSnapshot.data());
      
      const openingsContainer = document.getElementById("openings-container");
      // Show the openings container (which contains the buttons for each opening). 
      openingsContainer.style.display = "block"; 
      const openingData = docSnapshot.data();

      for (const openingName in openingData) { // Loop through the openings
        const openingButton = createOpeningButton(openingName, openingData);
        openingsContainer.appendChild(openingButton); // Add the button to the DOM
      }
      
      return openingData;

    } else {
      console.log("No such opening found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching opening data:", error);
    return null;
  }
};

// This updates the used indexes array for the opening that was clicked on.
// It should be: users [colleciton] > uid [document] > openings [collection] > openingID [document] > [name-of-the-opening][map] > "asWhiteUsedIndexes" or "asBlackUsedIndexes" [array]
async function updateOpeningUsedIndexes(uid, openingID, openingName, color, updatedUsedIndexesArray) {
  if (color !== 'asWhite' && color !== 'asBlack') {
    console.error('Invalid color. Please provide "asWhite" or "asBlack" as the color argument.');
    return;
  }

  const fieldName = color === 'asWhite' ? 'asWhiteUsedIndexes' : 'asBlackUsedIndexes';
  const db = getFirestore();
  const openingRef = doc(db, 'users', uid, 'openings', openingID);

  try {
    const openingDoc = await getDoc(openingRef);

    if (openingDoc.exists()) {
      const openingData = openingDoc.data();

      if (openingData[openingName]) {
        openingData[openingName][fieldName] = updatedUsedIndexesArray;

        await updateDoc(openingRef, openingData);
        console.log(`Updated ${fieldName} for openingID: ${openingID}, openingName: ${openingName}`);
      } else {
        console.error(`Opening name ${openingName} not found in openingID: ${openingID}`);
      }
    } else {
      console.error(`OpeningID ${openingID} not found for uid: ${uid}`);
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
