import { getFirestore, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";

export const flagLastDrill = async (uid) => {
  // Implement logic to add the last selected opening line to the corresponding FlaggedDrills array
  console.log("Flag Last Drill clicked");
};

export const removeLastFlaggedDrill = async (uid) => {
  // Implement logic to remove the last flagged drill from the corresponding FlaggedDrills array
  console.log("Remove Last Flagged Drill clicked");
};
