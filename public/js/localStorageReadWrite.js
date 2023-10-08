import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    updateDoc
  } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
import { fetchUserData, getCurrentUserId } from './userDataInteractions.js';



export const storeOpeningDataInLocalStorage = (openingData) => {
    try {
        localStorage.setItem('openingData', JSON.stringify(openingData));
    } catch (error) {
        console.error('Error storing opening data in local storage:', error);
    }
};

export const getOpeningDataFromLocalStorage = () => {
    try {
        const openingData = localStorage.getItem('openingData');
        if (openingData === null) return null;
        return JSON.parse(openingData);
    } catch (error) {
        console.error('Error getting opening data from local storage:', error);
        return null;
    }
};

export const compareServerData = async (uid) => {
    try {
        // Fetch data from Firestore
        const openingDataFromFirestore = await fetchUserData(uid);

        // Retrieve data from localStorage
        const openingDataFromLocalStorage = getOpeningDataFromLocalStorage();

        // Check if data exists in localStorage, and compare their content if it does
        let areEqual = true;
        if (openingDataFromLocalStorage === undefined) {
            areEqual = false;
        } else {
            areEqual = JSON.stringify(openingDataFromFirestore) === JSON.stringify(openingDataFromLocalStorage);
        }
        // Read the maxPracticeDepth from Firestore and display it in the input field
        document.getElementById('maxDepth').value = openingDataFromFirestore.maxPracticeDepth;
        
        console.log("Is the data from Firestore equal to the data from localStorage?", areEqual);
        return areEqual; // return the result

    } catch (error) {
        console.error("Error comparing openingData:", error);
        return false; // return false in case of error
    }
};


// event listener to the button to store the new maxPracticeDepth value to Firestore:
document.getElementById('storeMaxPracticeDepthButton').addEventListener('click', async () => {
    try {
        const newValue = parseInt(document.getElementById('maxDepth').value);
        
        const uid = getCurrentUserId();

        // Basic validation: Check if the input is a number and is not NaN
        if (isNaN(newValue)) {
            alert('Please enter a valid number.');
            return;
        }

        const db = getFirestore();
        await updateDoc(doc(db, "users", uid), { maxPracticeDepth: newValue });

        // if (window.location.pathname.includes('RepetoireChessboard.html')) {
            
        //     resetGame();
        // }

        // Optionally, give feedback to the user that the value was updated
        // alert('Max Practice Depth updated successfully!');
        console.log('Max Practice Depth updated to: ', newValue);
    } catch (error) {
        console.error('Error updating Max Practice Depth:', error);
        alert('Failed to update Max Practice Depth. Please try again.');
    }
});
