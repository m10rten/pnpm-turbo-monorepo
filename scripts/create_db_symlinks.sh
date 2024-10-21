#!/bin/bash

# Check if both arguments are provided
if [ $# -ne 2 ]; then
    echo "Usage: $0 <target> <link>"
    exit 1
fi

# Assign arguments to variables
TARGET="$1"
LINK="$2"

# Check if the symlink already exists
if [ ! -L "$LINK" ]; then
    # Create the symlink if it doesn't exist
    ln -s "$TARGET" "$LINK"
    echo "Symlink created successfully."
else
    echo "Symlink already exists."
fi