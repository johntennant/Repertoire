// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: magic;


module.exports.openURLorPGN = (url) =>
  {
    // checks if the first character of a string is a number
    // if no, then open the URL
    // if yes, then open a mPGNPlaybackChessboard.html and copy the 'url' to the clipboard

    if (isNaN(url.charAt(0))) {
      Safari.open(url);
    }
    else {
      const pgnString = url;
      const encodedPgnString = encodeURIComponent(pgnString);
      const urlPlusPGN = `https://www.johntennant.com/PGNChessDrilljs/mPGNPlaybackChessboard.html?pgn=${encodedPgnString}`;
      // Load the URL with Safari or WebView, depending on your needs

      Safari.open(urlPlusPGN);
      let pasteboard = Pasteboard.copyString(url);
    }


  }