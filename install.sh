#!/bin/bash

# Define paths
SOURCE_DIR=$(pwd)
PLUGIN_NAME="com.oscarnava.n8n.sdPlugin"
DEST_DIR="$HOME/Library/Application Support/com.elgato.StreamDeck/Plugins/$PLUGIN_NAME"

echo "Building plugin..."
npm run build

echo "Installing $PLUGIN_NAME..."

# Remove existing installation
if [ -d "$DEST_DIR" ]; then
    echo "Removing old version..."
    rm -rf "$DEST_DIR"
fi

# Copy new version
echo "Copying plugin to $DEST_DIR..."
mkdir -p "$DEST_DIR"
cp -R * "$DEST_DIR/"

# Fix permissions explicitly
echo "Fixing permissions..."
chmod +x "$DEST_DIR/run-plugin.sh"
chmod +x "$DEST_DIR/dist/index.js"

# Remove quarantine attributes (Gatekeeper)
echo "Removing quarantine attributes..."
xattr -d com.apple.quarantine "$DEST_DIR/run-plugin.sh" 2>/dev/null || true
xattr -d com.apple.quarantine "$DEST_DIR/dist/index.js" 2>/dev/null || true

# Ad-hoc sign the binaries (Essential for Apple Silicon)
echo "Signing binaries..."
codesign --force --deep --sign - "$DEST_DIR/run-plugin.sh" 2>/dev/null || true
codesign --force --deep --sign - "$DEST_DIR/dist/index.js" 2>/dev/null || true

# Handle Production Sync (Optional)
PROD_DIR="/Users/oscarnava/Documents/Proyectos/n8n-streamdeck-production"
if [ -d "$PROD_DIR" ] && [ "$SOURCE_DIR" != "$PROD_DIR" ]; then
    echo "Syncing changes to production folder..."
    cp -r "$SOURCE_DIR/src" "$PROD_DIR/"
    cp -r "$SOURCE_DIR/ui" "$PROD_DIR/"
    cp -r "$SOURCE_DIR/images" "$PROD_DIR/"
    cp "$SOURCE_DIR/manifest.json" "$PROD_DIR/"
    cp "$SOURCE_DIR/package.json" "$PROD_DIR/"
    cp "$SOURCE_DIR/tsconfig.json" "$PROD_DIR/"
    cp "$SOURCE_DIR/run-plugin.sh" "$PROD_DIR/"
    cp "$SOURCE_DIR/run-plugin.bat" "$PROD_DIR/"
    cp "$SOURCE_DIR/install.sh" "$PROD_DIR/"
fi

echo "------------------------------------------------"
echo "Installation Complete!"
echo "Killing Stream Deck process to ensure clean reload..."
pkill "Stream Deck" || echo "Stream Deck was not running."
echo "Please restart Stream Deck manually from your Applications folder."
echo "------------------------------------------------"
