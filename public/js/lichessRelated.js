
// import the the current pgn as a new game in liches and create a link that will work
// with the lichess app on mobile


// function openInLichess() {
//     const pgnText = document.getElementById('pgnText').value.trim();
//     const orientation = window.repertoireBoard.orientation;
//     const playerColor = orientation === 'white' ? 'white' : 'black';
  
//     fetch('https://lichess.org/api/import', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded'
//       },
//       body: `pgn=${encodeURIComponent(pgnText)}&color=${playerColor}`
//     })
//     .then(response => response.json())
//     .then(data => {
//       if (data && data.url) {
//         const lichessUrl = data.url;
//         // window.open(lichessUrl, '_blank'); // This will open the link in a new tab
//         window.location.href = lichessUrl; // This will open the link in the same tab

//       } else {
//         console.error('Error importing game to Lichess:', data);
//       }
//     })
//     .catch(error => console.error('Error importing game to Lichess:', error));
//   }

function openInLichess() {
  // Get the PGN text and player color from the webpage
  const pgnText = document.getElementById('pgnText').value.trim();
  const orientation = window.repertoireBoard.orientation;
  const playerColor = orientation === 'white' ? 'white' : 'black';

  // Assemble the data into a JSON object
  const dataToSend = JSON.stringify({ pgnText, playerColor });

  // Print the json to the log to see what it looks like
  console.log(dataToSend);

  // Correct URL for the Firebase function
  const functionUrl = 'https://us-central1-project-repertoire.cloudfunctions.net/importToLichessv2';

  // Send the PGN text and player color to your server-side endpoint
  fetch(functionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: dataToSend
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data && data.url) {
        console.log('Lichess URL:', data.url);
        window.location.href = data.url;
      } else {
        console.error('Error importing game to Lichess:', data);
      }
    })
    .catch(error => {
      console.error('Error importing game to Lichess:', error);
    });
}

