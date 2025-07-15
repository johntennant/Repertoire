/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */


const functions = require('firebase-functions');
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const fetch = require('node-fetch');

// Function to extract the Lichess URL from the text
function extractLichessLink(text) {
  // Updated regex to match the new format
  const regex = /\[Site &quot;(https:\/\/lichess\.org\/[a-zA-Z0-9]+)&quot;\]/;
  const match = text.match(regex);
  
  if (match && match[1]) {
      return match[1]; // Directly return the matched URL part
  }
  return null;
}


exports.importToLichessv2 = functions.https.onRequest((req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
      // Preflight request handling
      res.set('Access-Control-Allow-Methods', 'POST');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
      res.set('Access-Control-Max-Age', '3600');
      res.status(204).send('');
  } else {
      const { pgnText, playerColor } = req.body;
      fetch('https://lichess.org/api/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `pgn=${encodeURIComponent(pgnText)}&color=${playerColor}`
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.text(); // Use .text() instead of .json() to handle non-JSON responses
      })
      .then(data => {
          // Use the extractLichessLink function to parse and extract the URL
          const url = extractLichessLink(data);
          if (url) {
              res.json({url}); // Send the extracted URL back to the client as JSON
          } else {
              throw new Error('URL could not be extracted from the response');
          }
      })
      .catch(error => {
          console.error('Error importing game to Lichess:', error);
          res.status(500).send('Error importing game to Lichess');
      });
  }
});


  

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});
