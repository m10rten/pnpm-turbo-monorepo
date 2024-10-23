#!/bin/bash

# Set the base directory
BASE_DIR="node_modules"

# Define the source file and destination folders
SOURCE_DIR="$BASE_DIR/prisma"
SOURCE_FILE="libquery_engine-linux-musl-arm64-openssl-3.0.x.so.node"
DEST_FOLDERS=(
    "$BASE_DIR/@prisma/mongo-client"
    "$BASE_DIR/@prisma/sqlite-client"
)

# Check if the source file exists
if [ ! -f "$SOURCE_DIR/$SOURCE_FILE" ]; then
    echo "Source file '$SOURCE_FILE' not found in '$SOURCE_DIR'. Skipping copy operation."
    exit 0
fi

# Loop through destination folders
for DEST_FOLDER in "${DEST_FOLDERS[@]}"; do
    # Create destination folder if it doesn't exist
    mkdir -p "$DEST_FOLDER"

    # Check if the file already exists in the destination
    if [ -f "$DEST_FOLDER/$SOURCE_FILE" ]; then
        echo "File already exists in $DEST_FOLDER. Skipping."
    else
        # Copy the file to the destination folder
        cp "$SOURCE_DIR/$SOURCE_FILE" "$DEST_FOLDER"
        if [ $? -eq 0 ]; then
            echo "File copied successfully to $DEST_FOLDER"
        else
            echo "Error: Failed to copy file to $DEST_FOLDER"
        fi
    fi
done

echo "Copy operation completed."