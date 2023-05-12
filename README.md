# Repertoire
# Welcome to Project-Repertoire! 

## Introduction: 

This web-app was created as a way to practice chess opening variations in a drill format, where each correct move from the user is automatically followed by the next move in the variation. This gives the feeling of playing a real game. Variations are selected using a shuffle scheme--which is basically random, but with history. I.E. A variation will not be selected a second time until all other variations from that opening have been selected. 

## Flagged Drills: 

After practicing a variation, there is an option to "Flag Last Drill". This will add the last selected variation to a bucket of Flagged Drills for White or Flagged Drills for Black. This is a good way to return to a sub-set of variations from many different openings. After practicing a Flagged Drill, there is a new option to "Remove Last Flagged Drill". This removes the drill that was just being practiced from whatever Flagged Drills bucket it came from. 

The "Flag Last Drill" and "Remove Last Flagged Drill" buttons are context-sensitive. I.E. they are hidden/visible at the right times. 

## User Account: 

After creating a user-account, you'll have two openings by default: The VonPopiel Gambit (26 variations) and the Busch-Gass Gambit (accepted/denied) (95 variations). William Graif FM is the author of the original Lichess studies used to create these openings in this app. He has (not quite yet) graciously given permission for them to be used in this context. You can see the original studies here: 

- Busch-Gass - Gambit <https://lichess.org/study/0JdXDBuf>
- Busch-Gass Gambit Denied - <https://lichess.org/study/ffhmxOxi>
- VonPopiel Gambit - <https://lichess.org/study/FvLbSBZn>

## Importing New Chess Openings:

The application supports importing chess openings from a text file using a simplified version of Portable Game Notation (PGN) format. 

IMPORTANT: Directly importing PGN files is not yet supported. 

## Preparation

Before you can import a new opening, you need to prepare a text file that contains the moves of the opening. Here's what the format of the file should look like:

```sh
1. d4  d5 2. e4 dxe4 3. Nc3 Nf6 4. Bg5 Bf5 5. f3 exf3 6. Qxf3 Bc8 7. O-O-O e6 *
1. d4 d5 2. e4 dxe4 3. Nc3 Nf6 4. Bg5 Bg4 5. Nge2 Nbd7 6. h3 Bh5 7. g4 Bg6 8. Nf4 e6 9. h4 h6 *
[...etc]
```

Each line break is parsed as a different variation of the opening.

IMPORTANT: Some special characters that are common in PGN files will not work if they are in your txt file. For instance, '%' definitely doesn't work. It's on the list to create an conversion process to go from a full-featured PGN into a correctly formatted text file that can be used by Repertoire. (At present it's down to a 3-step local process involving a commandline tool called 'pgn-extract' and some python scripts.)

## Importing the Opening

Once you have a local text file that's been prepared as described above, press the Import Opening button. Using the file-select dialog, select your prepared .txt file. The name of the text file becomes the name of the opening after it's imported. A dialog box will then appear, allowing you to select whether you want to pratice the variations as White or Black. After selecting the color, the opening is imported into the database associated with the current user and the color chosen. If you want to practice the opening as the other color, you must reimport the opening as that color. 

You should now see a new button with the same name as the text file you imported. 