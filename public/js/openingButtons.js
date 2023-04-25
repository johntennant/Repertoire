
// Retrieve the array of opening lines from the opening data.
// Also retrieve the array of used indexes from the opening data.

export function handleOpeningButtonClick(openingName, openingData) {
  console.log("Opening data for", openingName, ":", openingData);

  const selectedOpeningLines = [];
  const selectedOpeningUsedIndexes = [];
  let colorKey = '';

  for (const key in openingData) {
    if (key === "asWhite" || key === "asBlack") {
      selectedOpeningLines.push(...openingData[key]);
      colorKey = key;
    } else if (key === "asWhiteUsedIndexes" || key === "asBlackUsedIndexes") {
      selectedOpeningUsedIndexes.push(...openingData[key]);
    }
  }

  console.log("Selected Opening Lines:", selectedOpeningLines);
  console.log("Selected Opening Used Indexes:", selectedOpeningUsedIndexes);
  console.log("Color Key:", colorKey);

  return {
    lines: selectedOpeningLines,
    usedIndexes: selectedOpeningUsedIndexes,
    colorKey: colorKey,
  };
}
