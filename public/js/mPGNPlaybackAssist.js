import { excludePGNsOutsideMoveRange, countAndSortPgnOccurrences } from './mistakePgnProcessing.js';

let $status = $('#status');
let drillPGN = "1. e4 e5 2. Nf3 Nc6 "; //default test PGN string overridden by the PGN string in the PGN text field
let PGN_STRING = drillPGN;
let badGuessHintThreshold = 3;
let badGuesses = 0;
let game = new Chess();
let mistakeCount = 0;
let numberOfHints = 0;
let pgnLines = [];
let sanArray = pgnToSanArray(PGN_STRING);
let sanArrayIndex = 0;
let playerColor = 'white';
// let maxPracticeDepth = 5;
const urlParams = new URLSearchParams(window.location.search);
const color = urlParams.get('color');

const storedOpeningData = localStorage.getItem('openingData'); 
const openingData = JSON.parse(storedOpeningData);

let maxPracticeDepth = openingData.maxPracticeDepth;
console.log("maxPracticeDepth:", maxPracticeDepth);

function resetMaxPracticeDepth() {
  const storedOpeningData = localStorage.getItem('openingData'); 
  const openingData = JSON.parse(storedOpeningData);
  maxPracticeDepth = openingData.maxPracticeDepth;
}

console.log("mPGNPlaybackAssist.js loaded");
// alert('mPGNPlaybackAssist.js is running');
updateGameInfo("mPGNPlaybackAssist.js loaded Successfully")
// changeBackgroundColor()




// fetch PGN text. Create a new Chess() instance solely for the purpose of converting PGN to SAN
  
function fetchPGNTextAndLoadIt() {
  let pgnText = $('#pgnText').val()
  console.log(pgnText + " from fetchPGNTextAndLoadIt()")

  if (pgnText) {
    loadNewPgn(pgnText)
  } else {
    
    // alert('Please enter a PGN string into the text field.')
  }
}

//Two functions to parse the PGN string into a sanArray and load the sanArray used later to determine if the user's move is correct.

function loadNewPgn(pgnText) {
  if (pgnText === "CLEAR_ALL_HISTORY") {
    clearPGNMistakesHistory();
    console.log("Cleared all history.");
  } else {
    game = new Chess();
    sanArray = pgnToSanArray(pgnText);
    sanArrayIndex = 0;
    board.position(game.fen());
    updateGameInfo();
    console.log(sanArray.length);
  }
}

function pgnToSanArray(pgnText) {
  if (pgnText === "CLEAR_ALL_HISTORY") {
    return [];
  }

  const game = new Chess();
  const pgnLoaded = game.load_pgn(pgnText);

  if (pgnLoaded) {
    const moves = game.history();
    return moves;
  } else {
    console.error("Invalid PGN string");
    return [];
  }
}

//Make PGN move is called in response to the user making the next correct move.
function makePGNMove () {
  if (sanArray[sanArrayIndex] === undefined) {
    changeBackgroundColor()
  } else {
    game.move(sanArray[sanArrayIndex]);
    console.log(sanArray[sanArrayIndex]);
    board.position(game.fen());
    badGuesses = 0
    sanArrayIndex++; 
    console.log(sanArrayIndex)
    updateMoveNumber();
    if (sanArrayIndex === sanArray.length)
     {
      changeBackgroundColor()
    } else
    if (sanArrayIndex > maxPracticeDepth)
     {
      // changeBackgroundColor()
    }}
}

// Color the background of the board green for 3 seconds. Big success! 
//This is called when the user has reached the end of the PGN string.
function changeBackgroundColor() {
  const originalBackgroundColor = document.body.style.backgroundColor;
  setTimeout(function() {
      document.body.style.backgroundColor = 'green';
    }, 100);
  setTimeout(function() {
      document.body.style.backgroundColor = originalBackgroundColor;
    }, 3000);
    resetResetButtonColor();
}

// Show correct move
function showCorrectMove() {
  // Extract the full move string from the sanArray
  const correctMove = sanArray[sanArrayIndex];

  console.log(correctMove);

  // Update the content of the 'correct-move' element
  const $correctMoveElement = $('#correct-move');
  $correctMoveElement.text(`${correctMove}`);

  // Reset the content of the 'correct-move' element after 3 seconds
  setTimeout(() => {
    $correctMoveElement.text('');
  }, 3000);

  changeResetButtonColorToGreen();
  window.setTimeout(resetResetButtonColor, 450);
}


// Update the mistakes count.

function updateMistakeCount(mistakes, hints) {
  const mistakesCountElement = document.getElementById('mistake-count');
  mistakesCountElement.textContent = `Mistakes: ${mistakes}:${hints}`;
  console.log(`Mistakes: ${mistakes}`);
}

// Update Move Number. 
function updateMoveNumber() {
  const moveNumberElement = document.getElementById('move-number');
  const adjustedIndex = sanArrayIndex + 1;
  const moveNumber = Math.ceil(adjustedIndex / 2);
  const numbersOfMoves = Math.ceil(sanArray.length / 2);

  moveNumberElement.textContent = `Move: ${moveNumber}/${numbersOfMoves}`;
  console.log(`Move: ${moveNumber} Number of moves: ${numbersOfMoves}`);

  // Check if numberOfMoves is 2
  if (numbersOfMoves == 2) {
    // Wait for 100ms and then call the updateMoveNumber function again
    setTimeout(updateMoveNumber, 100);
  }
}


//Buttons

//Load PGN Text Button
$('#PgnTextButton').on('click', function() {
  // Load PGN from the text entry field
  fetchPGNTextAndLoadIt()
});

//Play As Black: Flips the board orientation and also triggers the first move.

function flipBoardAndMakeFirstMove() {
  board.setOrientation(ChessUtils.ORIENTATION.flip);
  playerColor = 'black';
  makeFirstMove();
}

document.getElementById('playAsBlack').addEventListener('click', flipBoardAndMakeFirstMove);

//Flip Board Button

document.getElementById('flipBoardButton').addEventListener('click', flipBoard);

function flipBoard() {
  board.setOrientation(ChessUtils.ORIENTATION.flip);
}

//Reset Button

document.getElementById("resetButton").addEventListener("click", resetGame);

//Reset Game button color to green or back to the original color.

function changeResetButtonColorToGreen() {
  const resetButton = document.getElementById('resetButton');
  if (resetButton) {
    resetButton.style.backgroundColor = 'green';
  } else {
    console.error('Reset button not found');
  }
}

function resetResetButtonColor() {
  const resetButton = document.getElementById('resetButton');
  if (resetButton) {
    resetButton.style.backgroundColor = ''; // This will reset the background color to its original value
  } else {
    console.error('Reset button not found');
  }
}

// Check color and flip board if necessary.
function checkColorAndFlipBoard() {
  if (color === "asBlack") {
    flipBoardAndMakeFirstMove();
  }
}

//Button to make first move when human player is black.

function makeFirstMove() {
  if (sanArrayIndex === 0) {
    game.move(sanArray[sanArrayIndex]);
    board.position(game.fen());
    sanArrayIndex++;
    updateGameInfo("The next player is black.");
  } else {
    alert('The first move has already been made.');
  }
}

document.getElementById('makeFirstMoveButton').addEventListener('click', makeFirstMove);

//Button to show correct move

// document.getElementById('showCorrectMoveButton').addEventListener('click', showCorrectMove);
document.getElementById('showCorrectMoveButton').addEventListener('click', () => {
  showCorrectMove();
  numberOfHints++;
  updateMistakeCount(mistakeCount, numberOfHints);
});


//This is called when the user makes a mistake. It stores the PGN into an array of all the mistakes made by the user. 
// It's just in localStorage so it could be cleared easily. 

function storeCurrentPgnAsMistake() {
  // Retrieve the existing array of PGNs from localStorage or initialize a new one
  let pgnArray = JSON.parse(localStorage.getItem('pgnArray')) || [];

  // Add the current game PGN to the array
  pgnArray.push(game.pgn());

  // Save the updated array back to localStorage
  localStorage.setItem('pgnArray', JSON.stringify(pgnArray));

  // Log the contents of pgnArray
  console.log("Mistakes PGN Array contents:", pgnArray);

  const pgnMistakesDistilled = excludePGNsOutsideMoveRange(4, 8);
  const sortedOccurrences = countAndSortPgnOccurrences(pgnMistakesDistilled);
  console.log('Sorted PGN Occurrences:', sortedOccurrences);
}

function clearPGNMistakesHistory() {
  // Remove the pgnArray from localStorage
  localStorage.removeItem('pgnArray');
}


//------------------------+++This is where the chessboard-js code starts (unless commented otherwise)----------------------+++//

let board = new Chessboard('board', {
  position: ChessUtils.FEN.startId,
  eventHandlers: {
    onPieceSelected: pieceSelected,
    onMove: pieceMove
  }
});

window.repertoireBoard = board;

resetGame();

export function resetGame() {
  sanArrayIndex = 0; // Reset the sanArrayIndex to 0 so that the next move is the first move in the array - the first move in the PGN Text that was loaded. 
  mistakeCount = 0; // Reset the mistake count to 0
  numberOfHints = 0; // Reset the number of hints to 0
  updateMistakeCount(mistakeCount, numberOfHints); // Update the mistake count on the page
  board.setPosition(ChessUtils.FEN.startId);
  game.reset();
  updateGameInfo('Next player is white.');
  board.setOrientation(ChessUtils.ORIENTATION.white);
  playerColor = 'white';
  updateMoveNumber();
  resetMaxPracticeDepth();
  window.setTimeout(checkColorAndFlipBoard, 1000);
}

function updateGameInfo(status) {
  $('#info-status').html(status);
  $('#info-fen').html(game.fen());
  $('#info-pgn').html(game.pgn());
}

function pieceMove(move) {

  let nextPlayer,
    status,
    chessMove = game.move({
      from: move.from,
      to: move.to,
      promotion: 'q'
    });


  nextPlayer = 'white';
  if (game.turn() === 'b') {
    nextPlayer = 'black';
  }

  // If the move matches the next move in the sanArray, then increment the sanArrayIndex and update the status. Otherwise, increment the badGuesses counter and show the correct move if the threshold is reached.
  console.log(chessMove.san)

  if (chessMove.san === sanArray[sanArrayIndex]) {
    
    console.log("success");
    sanArrayIndex++;
    window.setTimeout(makePGNMove, 450);
    updateGameInfo();

  } else {
    game.undo(); // Revert the last move because it was incorrect.
    updateGameInfo();
    badGuesses++;
    mistakeCount++;
    updateMistakeCount(mistakeCount, numberOfHints);
    // console.log(mistakeCount);
    console.log("Bad guess number ", badGuesses, "out of ", badGuessHintThreshold);
    console.log(game.pgn())
    storeCurrentPgnAsMistake();
    if (badGuesses >= badGuessHintThreshold) {
      showCorrectMove(); 
    }
  }

  return game.fen();
}


function pieceSelected(notationSquare) {
  let i,
    movesNotation,
    movesPosition = [];

  movesNotation = game.moves({square: notationSquare, verbose: true});
  for (i = 0; i < movesNotation.length; i++) {
    movesPosition.push(ChessUtils.convertNotationSquareToIndex(movesNotation[i].to));
  }
  return movesPosition;
}
