// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: bomb;

//This script reads the last drill url from a file and then writes it to a list of 'flagged drill' in another file. 

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

    // Write the new url to the flagged url list. 
    
    fileArray.push(urlFileString);
    let newFileString = fileArray.join('\n');

    fm.writeString(path, newFileString);

}

await run();

Script.complete()