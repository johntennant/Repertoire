// checks if the first character of a string is a number
// if no, then open the URL. If yes, then store the PGN string to localStorage and open the RepertoireChessboard page


export function openURLorPGN(string, color) {
  if (isNaN(string.charAt(0))) {
    window.location.href = string;
  } else {
    let pgnString = string;
    localStorage.setItem("pgn", pgnString); // Store PGN string to localStorage
    const encodedColor = encodeURIComponent(color);
    const urlPlusPGN = `RepetoireChessboard.html?color=${encodedColor}`;
    // Load the URL in the same tab
    window.location.href = urlPlusPGN;
  }
}
