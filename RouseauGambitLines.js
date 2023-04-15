// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: purple; icon-glyph: chess-pawn;
// This script opens a random URL from a text file

let urlDrillsFile = "RouseauGambitLines.txt"
let usedIndexFile = "RouseauGambitUsedIndexes.txt"

// Read the used indexes from usedIndexFile and the URLs from the URL file. 

let fm = FileManager.iCloud()
let usedIndexesPath = fm.joinPath(fm.documentsDirectory(), usedIndexFile);
let urlsFilePath = fm.joinPath(fm.documentsDirectory(), urlDrillsFile);
await fm.downloadFileFromiCloud(usedIndexesPath);
await fm.downloadFileFromiCloud(urlsFilePath);

// Import urlShuffle module and run pickUrl. 
let urlShuffle = importModule('/lib/urlShuffle');
let url = urlShuffle.pickUrl(usedIndexesPath, urlsFilePath);

// Import openURLorPGNLine module and run openURLorPGN.
let openURLorPGNLine = importModule('/lib/openURLorPGNLine');
openURLorPGNLine.openURLorPGN(url);

// Import openURLorPGNLine module and run openURLorPGN.
// await Safari.open(url);
// Pasteboard.copyString(url);

Script.complete()