# Importing the regular expression and system modules
import re
import sys
import os

# Function to clean a PGN file
def clean_pgn(input_file):
    # Open the input file in read mode
    with open(input_file, 'r') as f:
        # Read the content of the file
        content = f.read()

    # Remove all substrings that are within square brackets, including the brackets themselves
    content = re.sub(r'\[Event.*?\]', '', content)
    content = re.sub(r'\[Site.*?\]', '', content)
    content = re.sub(r'\[Date.*?\]', '', content)
    content = re.sub(r'\[Round.*?\]', '', content)
    content = re.sub(r'\[White.*?\]', '', content)
    content = re.sub(r'\[Black.*?\]', '', content)
    content = re.sub(r'\[Result.*?\]', '', content)
    content = re.sub(r'\[ECO.*?\]', '', content)
    content = re.sub(r'\[Opening.*?\]', '', content)
    content = re.sub(r'\[Annotator.*?\]', '', content)
    content = re.sub(r'\[UTCDate.*?\]', '', content)
    content = re.sub(r'\[UTCTime.*?\]', '', content)
    content = re.sub(r'\[Variant.*?\]', '', content)
    pattern = re.compile(r'\{\s*\[%eval.*?\]\s*\}', re.DOTALL)
    content = pattern.sub('', content)
    content = re.sub(r'\[PlyCount "\d+"\]', '', content)
    content = re.sub(r'\[SourceDate "\d{4}\.\d{2}\.\d{2}"\]', '', content)

    # Replace multiple newline characters with a single newline character
    content = re.sub(r'\n{2,}', '\n', content)
    # Remove leading and trailing whitespaces
    content = content.strip()
    # Fix 1.1. with 1.
    # content = content.replace('1.1.', '1.')

    # Split the content into games. Each game starts with '1. ' on a new line
    games = re.split(r'\n1\. ', content)
    # Prepend '1. ' to each game and replace newline characters within a game with a space
    games = ['1. ' + game.replace('\n', ' ').strip() for game in games]
    
    print(f"Input PGN Filename is: {input_file}")
    
    # Construct the name of the output file by removing '_AllGames.pgn' from the input file name and appending '.txt'
    output_file = input_file.replace('_AllGames.pgn', '') + '.txt'

    # Open the output file in write mode
    with open(output_file, 'w') as f:
        # Write the cleaned games to the output file, separated by newline characters
        f.write('\n'.join(games))

    # Open the output file again to replace "1." with "1.{filename}" at the start of lines
    with open(output_file, 'r+') as f:
        content = f.read()
        base_filename = os.path.splitext(os.path.basename(output_file))[0]  # Get filename without path and extension
        content = re.sub(r'(^|\n)1\.', r'\g<1>1. {' + base_filename + '}', content)  # Enclose filename in {}
        f.seek(0)
        f.write(content)
        f.truncate()

    # Return the name of the output file
    return output_file

# Main function
if __name__ == "__main__":
    # Check if the input file name was passed as a command-line argument
    if len(sys.argv) < 2:
        # If not, print the usage of the script and exit
        print("Usage: python script.py <input_pgn_file>")
        sys.exit(1)

    # Get the name of the input file from the command-line arguments
    input_file = sys.argv[1]
    # Call the clean_pgn function with the input file
    output_file = clean_pgn(input_file)
    # Print the name of the output file
    print(f"Cleaned PGN file saved as: {output_file}")