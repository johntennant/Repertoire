// checks if the first character of a string is a number
// if no, then open the URL
// if yes, then open a mPGNPlaybackChessboard.html and copy the 'string' to the clipboard
 
export function openURLorPGN(string) {
  if (isNaN(string.charAt(0))) {
    window.location.href = string;
  } else {
    const pgnString = string;
    const encodedPgnString = encodeURIComponent(pgnString);
    const urlPlusPGN = `https://www.johntennant.com/PGNChessDrilljs/mPGNPlaybackChessboard.html?pgn=${encodedPgnString}`;

    // Load the URL in the same tab
    window.location.href = urlPlusPGN;
  }
}
