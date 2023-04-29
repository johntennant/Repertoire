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

// Is needed anymore? (see below)
// export const getUserData = async (uid) => {
//   try {
//     const db = getFirestore();
//     const userRef = doc(collection(db, "users"), uid);
//     const userDoc = await getDoc(userRef);

//     if (userDoc.exists()) {
//       console.log("User data:", userDoc.data());
//       return userDoc.data();
//     } else {
//       console.log("No such user found.");
//       return null;
//     }
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     return null;
//   }
// };

// Creates a button for each opening in the user's openings collection
// and registers a click event listener for the button
// The click event listener calls the handleOpeningButtonClick function
// with the opening data and returns the selected opening line
// and the updates the used indexes array.

async function createOpeningButton(openingName, openingData) {
  const button = document.createElement("button");
  button.textContent = openingName;
  button.classList.add("opening-button");
  button.addEventListener("click", async () => {
    const uid = getCurrentUserId();
    const openingID = 'openingID';

    const fetchedDataResult = await handleOpeningButtonClick(uid, openingName);
    const selectedOpeningLines = fetchedDataResult.lines;
    console.log("Selected Opening Lines:", selectedOpeningLines);
    const selectedOpeningUsedIndexes = fetchedDataResult.usedIndexes;

    const shuffleResult = shufflePickString(selectedOpeningLines, selectedOpeningUsedIndexes);
    const selectedOpeningLine = shuffleResult.pickedString;
    console.log("From userDataInteractions.js, Selected Opening Line:", selectedOpeningLine);

    const updatedUsedIndexesArray = shuffleResult.updatedUsedIndexes;
    const colorKey = fetchedDataResult.colorKey;
    console.log("From userDataInteractions.js, Color Key:", colorKey);

    openURLorPGN(selectedOpeningLine);
    updateOpeningUsedIndexes(uid, openingID, openingName, colorKey, updatedUsedIndexesArray);
  });
  return button;
}


// When a user logs in, the opening data is retrieved
// and a button is created for each opening in the opening data.

// Too many nested loops.  Can we simplify this?

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

    for (const docSnapshot of docSnapshots) {
      if (docSnapshot.exists()) {
        console.log("Opening data:", docSnapshot.data());

        // Show the openings container (which contains the buttons for each opening).
        openingsContainer.style.display = "block";
        const openingData = docSnapshot.data();

        const openingNames = Object.keys(openingData).filter((openingName) => {
          return !openingName.endsWith("UsedIndexes") && openingName !== "FlaggedDrills";
        });

        for (const openingName of openingNames) {
          const openingButton = await createOpeningButton(openingName, openingData);
          openingsContainer.appendChild(openingButton); // Add the button to the DOM
        }
      } else {
        console.log(`No opening data found for ${
          docSnapshots.indexOf(docSnapshot) === 0 ? "asWhite" : "asBlack"
        }.`);
      }
    }
  } catch (error) {
    console.error("Error fetching opening data:", error);
  }
};



// This updates the used indexes array for the opening that was clicked on.
// It should be: users [colleciton] > uid [document] > openings [collection] > openingID [document] > [name-of-the-opening][map] > "asWhiteUsedIndexes" or "asBlackUsedIndexes" [array]
async function updateOpeningUsedIndexes(uid, openingID, openingName, color, updatedUsedIndexesArray) {
  if (color !== 'asWhite' && color !== 'asBlack') {
    console.error('Invalid color. Please provide "asWhite" or "asBlack" as the color argument.');
    return;
  }

  const db = getFirestore();
  const openingRef = doc(db, 'users', uid, 'openings', openingID);

  try {
    const openingDoc = await getDoc(openingRef);

    if (openingDoc.exists()) {
      const openingData = openingDoc.data();

      if (openingData[openingName]) {
        const usedIndexesRef = doc(db, 'users', uid, 'openings', openingID, openingName + 'UsedIndexes');
        await updateDoc(usedIndexesRef, { indexes: updatedUsedIndexesArray });
        console.log(`Updated used indexes for openingID: ${openingID}, openingName: ${openingName}`);
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


