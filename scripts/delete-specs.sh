#!/bin/bash

# Set the directory to start from.  Defaults to current directory if not provided.
directory="${1:-.}"

# Check if the directory exists
if [ ! -d "$directory" ]; then
  echo "Error: Directory '$directory' does not exist."
  exit 1
fi

# Use find to locate files containing ".spec." in their name and delete them.
# -type f:  Only look for files (not directories, etc.)
# -name "*.spec.*":  Find files matching the pattern.  The * is important to catch all variations.
# -print0:  Print the file names separated by a null character.  This handles filenames with spaces or special characters safely.
# xargs -0 rm:  Takes the filenames separated by null characters and executes `rm` on each one.  -0 is crucial for safety with spaces.

find "$directory" -type f -name "*.spec.*" -print0 | xargs -0 rm -f

echo "Deleted files containing '.spec.' in their name within '$directory' and its subdirectories."

exit 0