# Repertoire
# Welcome to Project-Repertoire

## What is this? 

This is a way to practice chess openings in a 'drill' format. When you make the right move, the next move is performed for you. Mistakes are ignored, but a "Mistakes" counter will increment. Once an opening has been imported, individual variations are selected using a shuffle scheme. (I.E. random, but with history. A variation will not be selected a second time until all other variations from that opening have been attempted.) 

The on a narrow screen--so if you're using a pc, I suggest resizing. For simplicity sake, Project Repertoire is using the chessboard-js javascript chess UI library.It's pretty basic, but it's working fine for now. Crucially this means: There are no plans to support drag and drop for chess moves in the near future.
## User Account: 

After creating a user-account, you'll have two openings by default: The VonPopiel Gambit [26 variations] and the Busch-Gass Gambit (accepted/denied combined) [95 variations]. William Graif FM is the author of the original Lichess studies used to create these default openings in this app. His openings are extremely fun (but also very dangerous!) to play and that's what inspired me to make this app. 
## Openings and Flagged Drills: 

You should now see buttons corresponding to each default opening. If press one of these buttons, a chessboard will load and you'll be prompted to make the first (or 2nd) move. As mentioned above, when you make the right move, the next move is performed for you. Mistakes are ignored, but a "Mistakes" counter will increment. If you're stuck, use the Show Correct Move button. For more info about the openings, scroll down to see a button for any links that were in the pgn text. 

There is an option to "Flag This Drill" or "Flag Last Drill"--depending on which page you're on. This will add the active variation to a bucket of "Flagged Drills for White" or "Flagged Drills for Black". With this feature we can return to a smaller sub-set of variations from many different openings. 

The "Flag This Drill", "Flag Last Drill", "Unflag This Drill", and "Remove Last Flagged Drill" buttons are context-sensitive. I.E. they are hidden/visible at the right times. 

At the botton of the chessboard page, there is also a "Flag This Drill"/"Unflag This Drill" button (depending on whether the last selected drill was a flagged drill or not). This button does exactly the same thing as "Flag Last Drill" and "Remove Last Flagged Drill" except it's from the chessboard page instead. If one of these buttons are used, they will be hidden on the index.html page to prevent redundantly adding/removing drills to the Flagged Drill list. 

The "Practice a New Flagged Drill" button will randomly select a drill from the Flagged Drills for White or Flagged Drills for Black buckets without the user having to return to the main page in between. 

## Importing New Chess Openings:

The application supports importing chess openings from a text file using a simplified version of Portable Game Notation (PGN) format. 

IMPORTANT: Directly importing PGN files is not yet supported. 

## Preparation

Before you can import a new opening, you need to prepare a text file that contains the moves of the opening. Here's what the basic format of the file should look like:

```sh
1. d4  d5 2. e4 dxe4 3. Nc3 Nf6 4. Bg5 Bf5 5. f3 exf3 6. Qxf3 Bc8 7. O-O-O e6 *
1. d4 d5 2. e4 dxe4 3. Nc3 Nf6 4. Bg5 Bg4 5. Nge2 Nbd7 6. h3 Bh5 7. g4 Bg6 8. Nf4 e6 9. h4 h6 *
[...etc]
```

Each line break is parsed as a different variation of the opening. Project-Repertoire doesn't yet support directly importing PGN files, but a conversion process is offered via a simple drag and drop batch file which uses a free, open-source commandline program called pgn-extract (https://github.com/MichaelB7/pgn-extract) in combination with a python script which completes the conversion process. A huge caveat here is the conversion process is imperfect. Some 'massaging' of the outputted result is sometimes needed. Because there are so many unexpected things that can be found in a PGN file, it's difficult to anticipate everything with a single script. 

You can download all three files here: https://github.com/johntennant/Repertoire/blob/master/Repertoire_PGN_Convert.zip

To use the batch file, you'll Python installed. Next, make sure the PGN filename is exactly what you want the opening to be called in your Repertoire database. (You'll understand why in a bit.) Then simply drag and drop a PGN file onto the batch file: "Drag PGN File Here.bat". A new text file will be created in the same directory as the PGN file. The text file will have the same name as the PGN file, but with a .txt extension. This new text file can be imported using the Import Opening button. 

## Importing the Opening

Once you have a local text file that's been prepared as described above, press the Import Opening button. Using the file-select dialog, select your prepared .txt file. The name of the text file becomes the name of the opening after it's imported. A dialog box will then appear, allowing you to select whether you want to pratice the variations as White or Black. After selecting the color, the opening is imported into the database associated with the current user and the color chosen. If you want to practice the opening as the other color, you must reimport the opening as that color. 

You should now see a new button with the same name as the text file you imported. 