@echo off
set "inputfile=%~1"
set "outputfile=%~dpn1_AllGames.pgn"
pgn-extract --splitvariants -o "%outputfile%" "%inputfile%"
py clean_pgn.py "%~dpn1_AllGames.pgn"
pause
