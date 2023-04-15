// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: check-double;

//This script reads the last drill url from a file and then removes it from a list of 'flagged drills' in another file. 

async function run() {

    let fm = FileManager.iCloud();

    // Read the contents of the flaggedDrills file into an array. 

    let file = "FlaggedDrills.txt";
    let path = fm.joinPath(fm.documentsDirectory(), file);
    await fm.downloadFileFromiCloud(path);
    let fileString = fm.readString(path);
    let fileArray = fileString.split("\n");

    // Read the last picked url.

    let urlFile = "lastUrlPicked.txt";
    let urlFilepath = fm.joinPath(fm.documentsDirectory(), urlFile);
    await fm.downloadFileFromiCloud(urlFilepath);
    let urlFileString = fm.readString(urlFilepath);

    // Read the last picked indexes array. 
    let urlIndexFile = "FlaggedDrillsUsedIndexes.txt";
    let urlIndexFilepath = fm.joinPath(fm.documentsDirectory(), urlIndexFile);
    await fm.downloadFileFromiCloud(urlIndexFilepath);
    let urlIndexFileString = fm.readString(urlIndexFilepath);
    let indexFileArray = urlIndexFileString.split("\n");
    indexFileArray.pop();

    // Remove the URL from the flagged url list using filter--creating a new array. If the
    // original array is larger than the new array then we pop the last element of the IndexFileArray. 
    
    let fileArrayEdit = fileArray.filter(function (element) {
        return element !== urlFileString;
    });
    
    console.log(fileArray.length); 
    console.log(fileArrayEdit.length); 

    if (fileArray.length > fileArrayEdit.length) {
        indexFileArray.pop();
        let usedUrlIndexes = indexFileArray.join('\n');
        let usedUrlIndexesString = String(usedUrlIndexes);
  
        fm.writeString(urlIndexFilepath, usedUrlIndexesString);
    } else {console.log("The used indexes array was not modified because the url did not exist in the flagged url list.")}

    // fileArray.push(urlFileString);
    
    let newFileString = fileArrayEdit.join('\n');
    fm.writeString(path, newFileString);

}

await run();

Script.complete()