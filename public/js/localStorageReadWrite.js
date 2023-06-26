import { fetchUserData } from './userDataInteractions.js';


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

        console.log("Is the data from Firestore equal to the data from localStorage?", areEqual);
        return areEqual; // return the result

    } catch (error) {
        console.error("Error comparing openingData:", error);
        return false; // return false in case of error
    }
};


