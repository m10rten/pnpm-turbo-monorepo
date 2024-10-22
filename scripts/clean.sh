#!/bin/bash

# Define directories to clean
directories=("node_modules" ".turbo" "dist")

# Function to clean a specific directory type
clean_directories() {
    dir_type=$1
    echo "Cleaning all $dir_type directories..."
    find . -name "$dir_type" -type d -prune | while read -r dir; do
        echo "Removing $dir"
        npx rimraf "$dir"
    done
    echo "Finished cleaning $dir_type directories."
    echo
}

# Main execution
echo "Starting cleanup process..."
echo

# Clean each directory type
for dir in "${directories[@]}"; do
    clean_directories "$dir"
done

echo "All specified directories have been cleaned."