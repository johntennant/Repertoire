// checks if the first character of a string is a number
// if no, then open the URL
// if yes, then open a mPGNPlaybackChessboard.html and copy the 'string' to the clipboard
 
export function openURLorPGN(string) {
    if (isNaN(string.charAt(0))) {

      window.open(string, '_blank');
    
    } else {
    
      const pgnString = string;
      const encodedPgnString = encodeURIComponent(pgnString);
      const urlPlusPGN = `https://www.johntennant.com/PGNChessDrilljs/mPGNPlaybackChessboard.html?pgn=${encodedPgnString}`;
  
      // Load the URL with a new tab
      window.open(urlPlusPGN, '_blank');
  
      // Copy the URL to the clipboard
      navigator.clipboard.writeText(string).then(
        function () {
          console.log('Async: Copying to clipboard was successful!');
        },
        function (err) {
          console.error('Async: Could not copy text: ', err);
        }
      );
    }
  }
  