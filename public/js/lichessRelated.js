
// import the the current pgn as a new game in liches and create a link that will work
// with the lichess app on mobile

/*
function openInLichess() {
    const pgnText = document.getElementById('pgnText').value.trim();
    const orientation = window.repertoireBoard.orientation;
    const playerColor = orientation === 'white' ? 'white' : 'black';
  
    fetch('https://lichess.org/api/import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `pgn=${encodeURIComponent(pgnText)}&color=${playerColor}`
    })
    .then(response => response.json())
    .then(data => {
      if (data && data.url) {
        const lichessUrl = data.url;
        // window.open(lichessUrl, '_blank'); // This will open the link in a new tab
        window.location.href = lichessUrl; // This will open the link in the same tab

      } else {
        console.error('Error importing game to Lichess:', data);
      }
    })
    .catch(error => console.error('Error importing game to Lichess:', error));
  }
  */

  function openInLichess() {
    const pgnText = document.getElementById('pgnText').value.trim();
    const orientation = window.repertoireBoard.orientation;
    const playerColor = orientation === 'white' ? 'white' : 'black';
  
    fetch('https://cors-anywhere.herokuapp.com/https://lichess.org/api/import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `pgn=${encodeURIComponent(pgnText)}&color=${playerColor}`
    })
    .then(response => {
      // Log the response text for debugging
      return response.text().then(text => {
        console.log("Lichess response text:", text);
        return text ? JSON.parse(text) : {};
      });
    })
    .then(data => {
      if (data && data.url) {
        const lichessUrl = data.url;
         window.open(lichessUrl, '_blank'); // This will open the link in a new tab
        //window.location.href = lichessUrl; // This will open the link in the same tab
      } else {
        console.error('Error importing game to Lichess:', data);
      }
    })
    .catch(error => console.error('Error importing game to Lichess:', error));
  }
  