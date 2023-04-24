// It's not clear these vars are getting properly populated.
// TODO: Test this code to see if it works.

let selectedOpeningLines = [];
let selectedOpeningUsedIndexes = [];

// Retrieve the array of opening lines from the opening data.
// Also retrieve the array of used indexes from the opening data.

export function handleOpeningButtonClick(openingName, openingData) {
    console.log("Opening data for", openingName, ":", openingData);
  
    // should these be global scope?
    const selectedOpeningLines = [];
    const selectedOpeningUsedIndexes = [];
  
    for (const key in openingData) {
      if (key === "asWhite" || key === "asBlack") {
        selectedOpeningLines.push(...openingData[key]);
      } else if (key === "asWhiteUsedIndexes" || key === "asBlackUsedIndexes") {
        selectedOpeningUsedIndexes.push(...openingData[key]);
      }
    }
  
    console.log("Selected Opening Lines:", selectedOpeningLines);
    console.log("Selected Opening Used Indexes:", selectedOpeningUsedIndexes);
  }
  
  