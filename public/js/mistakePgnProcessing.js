// remove pgn entries that are too long. 

export function excludePgnsContainingMoveN(rawMistakesPGNarray, n) {

    const searchString = ` ${n}. `;
    // Filter the array of PGNs to remove those containing the search string
    let pgnMistakesAfterExlude = rawMistakesPGNarray.filter(pgn => !pgn.includes(searchString));

    // Save the filtered array back to localStorage
    // localStorage.setItem('pgnMistakesDistilled', JSON.stringify(pgnMistakesAfterExlude));

    // Log the contents of pgnMistakesAfterExlude
    // console.log("Filtered PGN Array contents:", pgnMistakesAfterExlude);

    return pgnMistakesAfterExlude;
}
  
 // remove pgn entries that are too short.

export function includePgnsContainingMoveN(pgnMistakesDistilled, n) {
    const searchString = ` ${n}. `;
    // Filter the array of PGNs to include only those containing the search string
    const pgnMistakesAfterInclude = pgnMistakesDistilled.filter(pgn => pgn.includes(searchString));
  
    // Save the filtered array to localStorage
    // localStorage.setItem('pgnMistakesDistilled', JSON.stringify(pgnMistakesAfterInclude));
  
    // Log the contents of the filtered array
    // console.log("PGN Mistakes Distilled contents after filtering for move", n, ":", pgnMistakesAfterInclude);
  
    return pgnMistakesAfterInclude;
}
  
export function excludePGNsOutsideMoveRange(moveNToInclude, moveNToExclude) {
    // Retrieve the original array of PGNs from localStorage
    let originalPgnArray = JSON.parse(localStorage.getItem('pgnArray')) || [];

    const excludedPGNs = excludePgnsContainingMoveN(originalPgnArray, moveNToExclude);
    const pgnMistakesDistilled = includePgnsContainingMoveN(excludedPGNs, moveNToInclude);

    // Save the filtered array to localStorage
    localStorage.setItem('pgnMistakesDistilled', JSON.stringify(pgnMistakesDistilled));

    // Log the contents of the filtered array
    console.log(`PGN Mistakes Distilled contents after excluding PGNs containing move ${moveNToExclude} and including PGNs containing move ${moveNToInclude}:`, pgnMistakesDistilled);

    return pgnMistakesDistilled;
}

export function countAndSortPgnOccurrences(pgnMistakesDistilled) {
    // Count the occurrences of each PGN string
    const counts = new Map();
    for (let pgn of pgnMistakesDistilled) {
        counts.set(pgn, (counts.get(pgn) || 0) + 1);
    }

    // Convert Map entries to an array and sort by count
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
}

