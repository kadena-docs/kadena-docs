#!/bin/bash

# Set variables for paths
REPO_URL="https://github.com/kadena-io/pact-5.git"
TEMP_DIR="temp-pact-5"
DOCS_DIR="docs/pact-5"
BUILTINS_DIR="docs/builtins"

# Clone the remote repository to a temporary directory
echo "Cloning kadena-io/pact-5 repository..."
git clone --depth=1 $REPO_URL $TEMP_DIR

# Check if the clone was successful
if [ $? -ne 0 ]; then
    echo "Failed to clone repository. Exiting."
    exit 1
fi

# Create the target directory if it doesn't exist
mkdir -p $DOCS_DIR

# Copy the builtins directory to the Docusaurus docs/pact-5 folder
echo "Copying builtins files into $DOCS_DIR..."
cp -r $TEMP_DIR/$BUILTINS_DIR/* $DOCS_DIR/

# Clean up by removing the temporary directory
echo "Cleaning up..."
rm -rf $TEMP_DIR

echo "Done! The builtins files have been merged into $DOCS_DIR."
