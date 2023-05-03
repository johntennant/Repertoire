import {
    getFirestore,
    doc,
    updateDoc,
    deleteField,
    writeBatch
  } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
import { getCurrentUserId, fetchUserData, buildUsersOpeningsUI, removeAllButtons } from "./userDataInteractions.js";

// Function for importing a new opening
async function importOpening() {
    console.log("Importing a new opening...");
  
    // Create a hidden file input element
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".txt";
    fileInput.style.display = "none";
  
    // Append the file input to the body
    document.body.appendChild(fileInput);
  
    // Listen for the change event
    fileInput.addEventListener("change", async (event) => {
      // Get the selected file
      const file = event.target.files[0];
  
      // Read the content of the file
      const fileContent = await readFile(file);
  
      // Assign the pgnArray to fileContent
      const pgnArray = fileContent.map(line => line.trim());
  
      // Remove the file input from the body
      document.body.removeChild(fileInput);
  
      // Show the "Play as White" or "Play as Black" dialog
      showColorSelectionDialog(file.name, pgnArray);
    });
  
    // Trigger the file input click event
    fileInput.click();
  }
  
  
async function readFile(file) {
return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split("\n"));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
});
}
  

function showColorSelectionDialog(openingName, pgnArray) {
    const colorSelectionDialog = document.createElement("div");
    colorSelectionDialog.innerHTML = `
      <div>
      <p>Select the color you want to play:</p>
      <button id="play-as-white-btn">Play as White</button>
      <button id="play-as-black-btn">Play as Black</button>
      </div>
    `;
    document.body.appendChild(colorSelectionDialog);
  
    const playAsWhiteButton = colorSelectionDialog.querySelector("#play-as-white-btn");
    const playAsBlackButton = colorSelectionDialog.querySelector("#play-as-black-btn");
  
    // Remove the file extension from the openingName
    const openingNameWithoutExtension = openingName.replace(/\.txt$/, "");
  
    playAsWhiteButton.addEventListener("click", () => {
      importOpeningToDatabase(openingNameWithoutExtension, pgnArray, "asWhite");
      document.body.removeChild(colorSelectionDialog);
    });
  
    playAsBlackButton.addEventListener("click", () => {
      importOpeningToDatabase(openingNameWithoutExtension, pgnArray, "asBlack");
      document.body.removeChild(colorSelectionDialog);
    });
  }
  

async function importOpeningToDatabase(openingName, pgnArray, color) {
    try {
      const db = getFirestore();
      const uid = getCurrentUserId();
  
      // Save the new opening to the user's database
      await updateDoc(doc(db, "users", uid, "openings", color), {
        [openingName]: pgnArray,
      });
  
    //   // Create the corresponding "UsedIndexes" entry
    //   await updateDoc(doc(db, "users", uid, "openings", color, "UsedIndexes"), {
    //     [openingName + "UsedIndexes"]: [],
    //   });
  
      // Refresh the openings UI
      await removeAllButtons();
      await buildUsersOpeningsUI(uid);
  
      console.log("New opening imported:", openingName);
    } catch (error) {
      console.error("Error importing opening:", error);
    }
  }
 
  
//:::::::: Function for removing an opening:::::::::
async function removeOpening() {
showRemoveOpeningModal();
console.log("Removing an opening...");
}

// Event listeners for the buttons
document.getElementById("import-new-opening-btn").addEventListener("click", importOpening);

// ::::Remove opening button logic::::

document.getElementById("remove-opening-btn").addEventListener("click", removeOpening);
  
  // Function to populate the select input with the user's openings
async function populateRemoveOpeningSelect(uid) {
    const select = document.getElementById("remove-opening-select");
  
    // Clear the existing options
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }
  
    // Fetch the openings from the user's database
    const openingData = await fetchUserData(uid);
  
    // Loop through the openings and add them to the select input
    for (const colorKey in openingData) {
      for (const openingName in openingData[colorKey]) {
        if (openingName === "FlaggedDrills" || openingName.endsWith("UsedIndexes")) continue;
        const option = document.createElement("option");
        option.value = `${colorKey}:${openingName}`;
        option.textContent = `${openingName} (${colorKey === "asWhite" ? "White" : "Black"})`;
        select.appendChild(option);
      }
    }
  }
  
  // Function to show the remove opening modal
  function showRemoveOpeningModal() {
    const modal = document.getElementById("remove-opening-modal");
    modal.style.display = "block";
    populateRemoveOpeningSelect(getCurrentUserId());
  }
  
  // Function to hide the remove opening modal 
  function hideRemoveOpeningModal() {
    const modal = document.getElementById("remove-opening-modal");
    modal.style.display = "none";
  }

// Event listener for the "Remove" button inside the modal
document.getElementById("remove-opening-confirm-btn").addEventListener("click", () => {
    const selectedOption = document.getElementById("remove-opening-select").value;
    console.log("Selected opening to remove:", selectedOption);
  
    const [color, openingName] = selectedOption.split(":");
  
    // Call openingToDeleteSelected function with the selected opening and color
    openingToDeleteSelected(openingName, color);
  
    hideRemoveOpeningModal();
  });
  
  
  // Event listener for the "Cancel" button inside the modal
  document.getElementById("remove-opening-cancel-btn").addEventListener("click", () => {
    hideRemoveOpeningModal();
  });

  function showDeleteConfirmationDialog(onConfirm, onCancel) {
    const confirmationDialog = document.createElement("div");
    confirmationDialog.innerHTML = `
      <div>
        <p>Are you sure? There is no undo.</p>
        <button id="yes-btn">Yes</button>
        <button id="no-btn">No</button>
      </div>
    `;
    document.body.appendChild(confirmationDialog);
  
    const yesButton = confirmationDialog.querySelector("#yes-btn");
    const noButton = confirmationDialog.querySelector("#no-btn");
  
    yesButton.addEventListener("click", () => {
      onConfirm();
      document.body.removeChild(confirmationDialog);
    });
  
    noButton.addEventListener("click", () => {
      onCancel();
      document.body.removeChild(confirmationDialog);
    });
  }
  
  async function openingToDeleteSelected(selectedOpening, color) {
    // Close the modal selection dialog
    hideRemoveOpeningModal();
  
    // Show delete confirmation dialog
    showDeleteConfirmationDialog(async () => {
      try {
        const db = getFirestore();
        const uid = getCurrentUserId();
  
        // Remove the selected opening
        await updateDoc(doc(db, "users", uid, "openings", color), {
            [selectedOpening]: deleteField(),
          });
          
        // Remove the corresponding UsedIndexes for the selected opening
        await updateDoc(doc(db, "users", uid, "openings", color), {
            [selectedOpening + "UsedIndexes"]: deleteField(),
        }); 
  
        // Refresh the openings UI
        await removeAllButtons();
        await buildUsersOpeningsUI(uid);
      } catch (error) {
        console.error("Error deleting opening:", error);
      }
    }, () => {
      console.log("Deletion canceled");
    });
  }
  

  // fetch default openings from url. 
  async function fetchTextFile(url) {
    const response = await fetch(url);
    const text = await response.text();
    return text;
  }
  
  async function fetchDefaultOpenings() {
    const whiteOpeningsUrl = "lib/defaultOpenings/VonPopielGambit.txt";
    const blackOpeningsUrl = "lib/defaultOpenings/BuschGassGambit.txt";
  
    const whiteOpening = await fetchTextFile(whiteOpeningsUrl);
    const blackOpening = await fetchTextFile(blackOpeningsUrl);
  
    return [
      {
        openingName: "VonPopielGambit",
        colorKey: "asWhite",
        lines: whiteOpening.split("\n"),
      },
      {
        openingName: "BuschGassGambit",
        colorKey: "asBlack",
        lines: blackOpening.split("\n"),
      }
    ];
  }
  

  //Create default openings
  export async function createDefaultOpeningsForNewUser(uid) {
    const db = getFirestore();
    const userRef = doc(db, "users", uid);
  
    const defaultOpenings = await fetchDefaultOpenings();
  
    const batch = writeBatch(db);
  
    // Set up the database structure
    const whiteOpeningRef = doc(userRef, "openings", "asWhite");
    const blackOpeningRef = doc(userRef, "openings", "asBlack");
    batch.set(whiteOpeningRef, {});
    batch.set(blackOpeningRef, {});
  
    // Initialize default openings
    defaultOpenings.forEach(opening => {
      const openingRef = opening.colorKey === 'asWhite' ? whiteOpeningRef : blackOpeningRef;
      batch.update(openingRef, {
        [opening.openingName]: opening.lines,
      });
    });
  
    // Initialize FlaggedDrills arrays
    batch.update(whiteOpeningRef, {
      FlaggedDrills: [],
    });
    batch.update(blackOpeningRef, {
      FlaggedDrills: [],
    });
  
    await batch.commit();
  }
  