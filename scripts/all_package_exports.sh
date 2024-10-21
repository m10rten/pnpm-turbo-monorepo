#!/bin/bash

# Check if a folder path is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <folder_path>"
    exit 1
fi

# Get the absolute path of the provided folder
packages_folder=$(realpath "$1")

# Check if the provided path is a directory
if [ ! -d "$packages_folder" ]; then
    echo "Error: $packages_folder is not a directory"
    exit 1
fi

# Function to generate exports for a package
generate_exports() {
    local package_folder="$1"
    echo "Generating exports for $package_folder"
    pnpm exports "$package_folder"
}

# Loop through each subfolder in the packages folder
for package_folder in "$packages_folder"/*/; do
    if [ -d "$package_folder" ]; then
        generate_exports "$package_folder"
    fi
done

echo "Export generation complete for all packages."