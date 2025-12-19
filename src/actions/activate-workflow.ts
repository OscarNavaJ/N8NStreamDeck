import streamDeck, { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import { n8nApi } from "../utils/n8n-api";

@action({ UUID: "com.oscarnava.n8n.activate" })
export class ActivateWorkflow extends SingletonAction<any> {
    async onKeyDown(ev: KeyDownEvent<any>) {
        const settings = ev.payload.settings;
        const workflowId = settings.workflowId;

        if (!workflowId) {
            streamDeck.logger.warn("Workflow ID is missing");
            await ev.action.showAlert();
            return;
        }

        try {
            streamDeck.logger.info(`Activating workflow ${workflowId}`);
            await n8nApi.activateWorkflow(workflowId);
            await ev.action.showOk();
        } catch (error) {
            streamDeck.logger.error(`Failed to activate workflow: ${error}`);
            await ev.action.showAlert();
        }
    }
}
