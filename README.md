# n8n Stream Deck Plugin

Control your n8n workflows directly from your Elgato Stream Deck. This plugin allows you to activate/deactivate workflows, trigger webhooks with various authentication methods, and monitor execution status in real-time.

---

## 🚀 Quick Start

1.  **Double-Click**: Open the `n8n.streamDeckPlugin` file.
2.  Stream Deck will automatically install it and prompt you to confirm.
3.  **Configure**: Click any n8n action in Stream Deck to set up your URL and API Key.

---

### For Developers
This is an **Open Source** project. You can find the full TypeScript source code in the `src/` folder.
1.  **Modify**: Edit the `.ts` files as needed.
2.  **Build**: Run `./install.sh` in the development folder to rebuild, install, and regenerate the distribution package.

*   **Base URL**: The full URL of your n8n instance (e.g., `https://n8n.yourdomain.com`).
*   **API Key**: Your n8n Public API key.

---

## 🔑 How to find your Credentials

### 1. n8n Instance URL
Your instance URL is the web address you use to access n8n in your browser.
*   **Cloud users**: Usually `https://<organization>.app.n8n.cloud`
*   **Self-hosted users**: Your custom domain or IP address (e.g., `http://192.168.1.50:5678`).

### 2. API Key
1.  Open your n8n instance in a browser.
2.  Go to **Settings** (bottom left gear icon).
3.  Select **Public API**.
4.  Copy your **API Key**. If you don't have one, click **Generate new API key**.

### 3. Workflow ID
Every workflow in n8n has a unique ID used for the **Activate**, **Deactivate**, and **Execution Status** actions.
1.  Open the workflow you want to control.
2.  Look at the **URL in your browser**.
3.  The ID is the alphanumeric string at the end of the URL:
    *   Example URL: `https://n8n.example.com/workflow/4oBqU6eOIYY2W7M9`
    *   Workflow ID: `4oBqU6eOIYY2W7M9`

---

## 🛠 Actions Guide

### 🟢 Activate Workflow
![Activate](images/activate.svg)
Enables a workflow by its ID.
*   **Use Case**: Quickly enable a scheduled automation.

### 🔴 Deactivate Workflow
![Deactivate](images/deactivate.svg)
Disables a workflow by its ID.
*   **Use Case**: Instantly stop a misbehaving workflow or perform maintenance.

### ⚡ Trigger Webhook
![Webhook](images/webhook.svg)
Triggers an n8n workflow via a Webhook node.
*   **Method**: Supports **GET** (default) or **POST**.
*   **Authentication**: Supports **None**, **Basic Auth**, **Header Auth**, and **JWT**.
*   **Body**: Allows sending a JSON payload to the workflow.

### 📊 Execution Status
![Status](images/status.svg)
Monitor the success or failure of your last workflow run.
*   **Success**: Displays the current status icon.
*   **Failure**: Displays an ephemeral **Red Cross** icon on the button for 2 seconds.

---

## 🔧 Troubleshooting
*   **404 Error on Trigger Workflow**: This usually means your n8n version is older than **v1.63.0**. Use the **Trigger Webhook** action instead.
*   **Connection Error**: Ensure your **Base URL** includes `http://` or `https://` and that your **API Key** is valid.
*   **Permissions**: If the plugin doesn't run on macOS, ensure you ran `./install.sh` which handles the necessary permissions and ad-hoc signing.

---

Created with ❤️ by [oscarnava](https://github.com/OscarNavaJ)
