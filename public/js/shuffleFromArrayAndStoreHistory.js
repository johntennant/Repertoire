// This function takes an array of strings and returns a random string from that array. 
// It also takes an array of integers that are the indexes of the strings that have been previously picked.
// So it will not pick the same string until all the strings have been picked.
// It returns an object with two properties: the string that was picked and the updated array of used indexes.
 
export function shufflePickString(usedIndexesArrayInt, stringArray) {
  console.log("Previously used indexes: ", usedIndexesArrayInt);
  console.log("Number of drills: ", stringArray.length);

  if (stringArray.length > usedIndexesArrayInt.length) {
    do {
      var stringIndex = Math.floor(Math.random() * stringArray.length);
      var stringIndexIsUsed = usedIndexesArrayInt.includes(stringIndex);
      console.log("Randomly picked index: ", stringIndex);
      console.log("Is picked index used? ", stringIndexIsUsed);
    } while (stringIndexIsUsed);
  } else {
    console.log("All strings have been used, resetting used indexes");
    usedIndexesArrayInt = [];
    var stringIndex = Math.floor(Math.random() * stringArray.length);
  }

  let string = stringArray[stringIndex];
  console.log("Picked string: ", string);

  usedIndexesArrayInt.push(stringIndex);
  console.log("Updated used indexes: ", usedIndexesArrayInt);

  // You can decide if you still want to store the last picked string in localStorage.
  // If not, you can remove this line.
  //localStorage.setItem("lastStringPicked", string);

  return {
    pickedString: string,
    updatedUsedIndexes: usedIndexesArrayInt,
  };
}

