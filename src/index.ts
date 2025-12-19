import streamDeck, { LogLevel } from "@elgato/streamdeck";
import * as fs from "fs";

// Debug log directly from Node
fs.appendFileSync("/tmp/n8n_node.log", `[${new Date().toISOString()}] Plugin starting...\n`);
fs.appendFileSync("/tmp/n8n_node.log", `[${new Date().toISOString()}] Args: ${process.argv.join(' ')}\n`);

import { TriggerWebhook } from "./actions/trigger-webhook";
import { GetExecutionStatus } from "./actions/get-status";
import { ActivateWorkflow } from "./actions/activate-workflow";
import { DeactivateWorkflow } from "./actions/deactivate-workflow";

// Initialize the plugin
streamDeck.logger.setLevel(LogLevel.INFO);

// Register the actions
streamDeck.actions.registerAction(new TriggerWebhook());
streamDeck.actions.registerAction(new GetExecutionStatus());
streamDeck.actions.registerAction(new ActivateWorkflow());
streamDeck.actions.registerAction(new DeactivateWorkflow());

streamDeck.connect();
