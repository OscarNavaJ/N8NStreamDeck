#!/bin/bash
LOG="/tmp/n8n_debug.log"
NODE_BIN="/usr/local/bin/node"

echo "----------------------------------------" >> "$LOG"
echo "[$(date)] Wrapper launching..." >> "$LOG"
echo "[$(date)] Arguments: $@" >> "$LOG"

if [ ! -x "$NODE_BIN" ]; then
    echo "[$(date)] CRITICAL: Node binary not found at $NODE_BIN" >> "$LOG"
    exit 1
fi

# Run execute the plugin
"$NODE_BIN" dist/index.js "$@" >> "$LOG" 2>&1
echo "[$(date)] Wrapper exited with code $?" >> "$LOG"
