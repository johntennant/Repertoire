# Repertoire
# Welcome to Project-Repertoire

## What is this? 

This is a way to practice chess openings in a 'drill' format. When you make the right move, the next move is performed for you. If make a move that isn't in the variation (or 'line'), no piece moves and a "Mistakes" counter increments. The individual lines of an opening are selected using a shuffle scheme. (I.E. random, but with history. A line will not be selected a second time until all other lines from that opening have been attempted.) 

A user can customize their openings list by importing their own. Openings need to be in a specific format--directly importing PGN files is not currently supported. See "Importing New Openings" below for more information on that process. 

Project Repertoire has a Firebase backend which is used to store the openings a user wants to practice, the shuffle history for the variations/lines of an opening, and the Flagged Lines buckets--which is a subset of opening lines the user is currently focused on memorizing. We're not storing anything else about the user. None of the google-analytics stuff is turned on. If you want signup with a fake email, that's fine. 

Other notes: Aesthetically, this web app is meant to run on a narrow screen--so if you're using a pc, it's suggested to resize to a width of 768px or less. For simplicity sake, we're using the chessboard-js javascript chess UI library (not to be confused with the chessboardjs library). It's simple to work with and so far, it does everything needed. Important: chessboard-js does not support drag and drop. For more information about chessboard-js, check out their github page: http://caustique.github.io/chessboard-js/#/
## User Account: 

After creating a user-account, you'll have 12 openings by default. William Graif FM is the author of the original Lichess studies used to create these default openings. These openings are fun to play and that's what inspired me to make this app. 
## General Usage: Openings

You should now see buttons corresponding to each opening stored for your account. The number beside each opening name is how many lines that opening has. If you press one of these buttons, a chessboard will load and you'll be prompted to make the first move as White or as Black. As mentioned above, when you make a correct move, the opponents move is performed for you. If you try a move that isn't in the line, a "Mistakes" counter will increment. If you're stuck, use the Show Correct Move button. For more info about the openings, scroll down to see a button for any links that were included in the pgn text (i.e. youtube videos or lichess studies.).

[Known Issue: Show Correct Move will only ever display three characters of the correct move. So if the correct move is 0-0-0, then it will actually only display 0-0. Another example: Nxf6 will be displayed as Nxf... etc.]

## General Usage: Flagged Lines
When you find a line of an opening that you'd like to memorize, there is button to "Flag This Line" or "Flag Last Line"--depending on which page you're on. This will add the active line to a bucket of "Flagged Lines for White" or "Flagged Lines for Black". This is so we can practice a smaller sub-set of lines from many different openings.  

On the chessboard page, the "Practice a New Flagged Line" button will randomly select a line from the "Flagged Lines for White" or "Flagged Lines for Black" buckets without the user having to return to the main page. 

## Importing New Chess Openings:

The web app supports importing chess openings from a text file using a modified version of Portable Game Notation (PGN) format. 

IMPORTANT: Directly importing PGN files is not yet supported. 

## Preparation

Before you can import a new opening, you need to prepare a text file that contains the moves of the opening. Here's what the basic format of the file should look like: 

https://github.com/johntennant/Repertoire/blob/master/wgraif_lichess_studies_converted/White/VonPopielGambit.txt

```sh
1.{VonPopielGambit} d4 { https://www.youtube.com/watch?v=ncH5j995LIs } 1... Nf6 2. Nc3 d5 3. e4 Nxe4 4. Nxe4 dxe4 5. Be3 { With the c3 and f6 knights swapped, this is a better version of the Blackmar-Diemer Gambit; White just plays f3 on basically any non-Bf5 move } { [%cal Gf2f3] } 5... Bf5 6. g4 Bg6 7. Ne2 e6 8. h4 h6 9. Nf4 Bh7 10. Qd2 { [%cal Ge1c1,Gd4d5,Gf4h5,Gg4g5,Gg5g6] } *
1.{VonPopielGambit} d4 { https://www.youtube.com/watch?v=ncH5j995LIs } 1... Nf6 2. Nc3 d5 3. e4 dxe4 4. Bg5 { Transposition } *
1.{VonPopielGambit} d4 { https://www.youtube.com/watch?v=ncH5j995LIs } 1... Nf6 2. Nc3 d5 3. e4 Nxe4 4. Nxe4 dxe4 5. Be3 { With the c3 and f6 knights swapped, this is a better version of the Blackmar-Diemer Gambit; White just plays f3 on basically any non-Bf5 move } { [%cal Gf2f3] } 5... Bf5 6. g4 Bg6 7. Ne2 e6 8. h4 h5 9. Nf4 *
[...etc]
```

Each line break is parsed as a different line of the opening. It's important to have the name of the opening at the beginning of each line. This is added automatically by the drag-and-drop PGN conversion script.

As mentioned before, Project-Repertoire doesn't yet support directly importing PGN files. To create your own openings for the app, you'll want to download the drag-and-drop batch file/python script. The process also uses a free, open-source commandline program called "pgn-extract" (https://github.com/MichaelB7/pgn-extract). 

Important: A huge caveat here is the conversion process is imperfect! Some 'massaging' of the outputted result is usually needed. There are many unexpected things that can be found in a PGN file which makes it's difficult to anticipate everything with a single script. 

Directly supporting PGN import into the app is actively in-progress. If you're keen to create your own openings before that's complete, you can download all three files needed for making your own Project-Repertoire format openings here: https://github.com/johntennant/Repertoire/blob/master/Repertoire_PGN_Convert.zip

## Conversion Script Usage: 

To use the batch file, you'll need Python installed. Next, make sure the PGN filename is exactly what you want the opening to be called in your Repertoire database. The filename gets added to the beginning of each line as the 'opening name'. Next, drag your PGN file onto the batch file: "Drag PGN File Here.bat". Two new files will be created, OpeningName_Complete.pgn and OpeningName.txt in the same directory. This new text file can be imported using the Import Opening button in the web app. 

## Importing the Opening

Once you have a local text file that's been prepared as described above, press the Import Opening button. Using the file-select dialog, select your prepared OpeningName.txt file. The name of the text file becomes the name of the opening after it's imported. Openings cannot be renamed. 

A dialog box will appear asking you to select whether you want to pratice the opening as White or as Black. After selecting the color, the opening is imported into the database associated with the current user and the color chosen. If you want to practice the opening as the other color, you must reimport the opening as that color. 

You should now see a new opening button with the same name as the text file you imported. 

## Conclusion

I primarily created Project Repertoire for my own personal use. (It's amazing the lengths I'll go to avoid actually practicing chess!) I have fulltime job that keeps me pretty busy and so I'm offering this up to the community without support. Please let me know if there are any bugs or (reasonable) feature requests, or if you'd like to help out with the project, but please don't take offense if I take a little while to respond. Peace! 