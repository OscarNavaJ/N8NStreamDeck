import streamDeck, { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import { n8nApi } from "../utils/n8n-api";

@action({ UUID: "com.oscarnava.n8n.deactivate" })
export class DeactivateWorkflow extends SingletonAction<any> {
    async onKeyDown(ev: KeyDownEvent<any>) {
        const settings = ev.payload.settings;
        const workflowId = settings.workflowId;

        if (!workflowId) {
            streamDeck.logger.warn("Workflow ID is missing");
            await ev.action.showAlert();
            return;
        }

        try {
            streamDeck.logger.info(`Deactivating workflow ${workflowId}`);
            await n8nApi.deactivateWorkflow(workflowId);
            await ev.action.showOk();
        } catch (error) {
            streamDeck.logger.error(`Failed to deactivate workflow: ${error}`);
            await ev.action.showAlert();
        }
    }
}
