/* 

localStorage.setItem("usedIndexesKey", "your_used_indexes_data_here");
localStorage.setItem("urlsKey", "your_urls_data_here");

*/

// This function will pick a random string (url or pgn line in our case) from the list of strings stored in localStorage.
// It will also store the index of the string that was picked in localStorage, so that it won't be picked again.
// If all strings have been picked, it will reset the list of used indexes and pick a random string again.
// It will also store the last picked string in localStorage, so that it can be added to the 'flagged drills' list if the 
// user wants to work on it again. See above for the localStorage keys that need to be set.

function pickUrl(usedIndexesKey, urlsKey) {
    let usedIndexes = localStorage.getItem(usedIndexesKey);
    let usedIndexesArray = usedIndexes ? usedIndexes.split("\n") : [];
  
    console.log("Previously used indexes: " + usedIndexes);
  
    let usedIndexesArrayIntUnfiltered = usedIndexesArray.map((line) =>
      parseInt(line, 10)
    );
  
    let usedIndexesArrayInt = usedIndexesArrayIntUnfiltered.filter(
      (x) => !isNaN(x)
    );
  
    let urlFile = localStorage.getItem(urlsKey);
    let urlArray = urlFile.split("\n");
  
    console.log("Number of drills: " + urlArray.length);
  
    if (urlArray.length > usedIndexesArrayInt.length) {
      do {
        var urlIndex = Math.floor(Math.random() * urlArray.length);
        var urlIndexIsUsed = usedIndexesArrayInt.includes(urlIndex);
      } while (urlIndexIsUsed);
    } else {
      usedIndexesArrayInt = [];
      var urlIndex = Math.floor(Math.random() * urlArray.length);
    }
  
    let url = urlArray[urlIndex];
  
    usedIndexesArrayInt.push(urlIndex);
    let usedUrlIndexes = usedIndexesArrayInt.join("\n");
    localStorage.setItem(usedIndexesKey, usedUrlIndexes);
  
    localStorage.setItem("lastUrlPicked", url);
  
    return url;
  }
  