import streamDeck, { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import { n8nApi } from "../utils/n8n-api";

@action({ UUID: "com.oscarnava.n8n.status" })
export class GetExecutionStatus extends SingletonAction<any> {
    async onKeyDown(ev: KeyDownEvent<any>) {
        const settings = ev.payload.settings;
        const workflowId = settings.workflowId;

        if (!workflowId) {
            streamDeck.logger.warn("Workflow ID is missing");
            await ev.action.showAlert();
            return;
        }

        try {
            streamDeck.logger.info(`Checking status for workflow ${workflowId}`);

            // Get latest execution
            const response = await n8nApi.getLatestExecution(workflowId);
            const executions = response.data;

            if (!executions || executions.length === 0) {
                streamDeck.logger.warn("No executions found");
                await ev.action.showAlert(); // No data yet
                return;
            }

            const latest = executions[0];
            const finished = latest.finished === true;
            // Common n8n statuses: 'success', 'error', 'waiting', 'crashed'
            const success = finished && (latest.data?.resultData?.error === undefined) && (latest.status !== 'error' && latest.status !== 'crashed');

            streamDeck.logger.info(`Latest execution: ${latest.id} - Status: ${latest.status || 'unknown'} - Finished: ${finished} - Success: ${success}`);

            if (success) {
                await ev.action.showOk();
            } else {
                streamDeck.logger.warn(`Execution failed or running: ${latest.status}`);

                // Show Custom Red Cross
                const crossSvg = `
                <svg width="144" height="144" viewBox="0 0 144 144" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#141414"/>
                    <path d="M36 36 L108 108 M108 36 L36 108" stroke="#FF3333" stroke-width="16" stroke-linecap="round" />
                </svg>`.trim();

                const encoded = `data:image/svg+xml;base64,${Buffer.from(crossSvg).toString('base64')}`;

                await ev.action.setImage(encoded);

                // Revert after 2 seconds
                setTimeout(async () => {
                    await ev.action.setImage(undefined); // undefined restores default
                }, 2000);
            }

        } catch (error) {
            streamDeck.logger.error(`Failed to get status: ${error}`);
            await ev.action.showAlert(); // Keep alert for system errors
        }
    }
}
