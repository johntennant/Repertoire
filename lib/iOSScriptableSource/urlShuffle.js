// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: magic;

// This module opens and shuffles URLs from a text file and keeps a history 
// of which indexes were used to prevent the same URL opening 
// before all others in the list are picked. We pass two variables to the
// method when calling it: usedIndexPath and urlsFilePath. 

module.exports.pickUrl = (usedIndexesPath, urlsFilePath) =>
{
  let fm = FileManager.iCloud()
  let usedIndexes = fm.readString(usedIndexesPath);
  let usedIndexesArray = usedIndexes.split("\n");

  // Show all the used indexes in the log

  log("Previously used indexes: " + usedIndexes);
  
  // Parse the contents of the file into an array of integers
  var usedIndexesArrayIntUnfiltered = usedIndexesArray.map(line => parseInt(line, 10));

  //Filter NaN values from the usedIndexesArrayIntUnfiltered

  var usedIndexesArrayInt = usedIndexesArrayIntUnfiltered.filter(x => !isNaN(x));

  // Read the URL from urlDrillsFile
  
  
  let urlFile = fm.readString(urlsFilePath);
  let urlArray = urlFile.split("\n");

  log("Number of drills: " + urlArray.length);

  // If the usedIndexes array length is less than the urlArray length, then pick 
  // a random.number between 0 and urlArray.length and check if usedIndexesArrayInt contains it. 
  // If yes, then pick again. If no, then let random.number = urlIndex and proceed 
  // If the usedIndexes array length is NOT less than the urlArray length then clear 
  // usedIndexesArrayInt and proceed with selection.
  
  if (urlArray.length > usedIndexesArrayInt.length) {
    do {
      var urlIndex = Math.floor(Math.random() * urlArray.length);
      var urlIndexIsUsed = usedIndexesArrayInt.includes(urlIndex);
    } while (urlIndexIsUsed);
  } else { usedIndexesArrayInt = [];
    var urlIndex = Math.floor(Math.random() * urlArray.length);
  }
  
  let url = urlArray[urlIndex];

  // Push the used index to usedIndexesArrayInt

  usedIndexesArrayInt.push(urlIndex);
  let usedUrlIndexes = usedIndexesArrayInt.join('\n');
  let usedUrlIndexesString = String(usedUrlIndexes);
  
  fm.writeString(usedIndexesPath, usedUrlIndexesString);

  // let text = fm.readString(usedIndexesPath);
  // await QuickLook.present(text)

  // write the chosen URL to a text file to be read later by 
  // another script the drill is one we want to study again later. 
  
  let lastUrlPickedFile = "lastUrlPicked.txt"
  let lastUrlPickedPath = fm.joinPath(fm.documentsDirectory(), lastUrlPickedFile);
  fm.writeString(lastUrlPickedPath, url);
  
  return url

}