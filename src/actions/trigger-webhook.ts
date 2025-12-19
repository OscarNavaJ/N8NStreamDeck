import streamDeck, { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import { n8nApi } from "../utils/n8n-api";

@action({ UUID: "com.oscarnava.n8n.webhook" })
export class TriggerWebhook extends SingletonAction<any> {
    async onKeyDown(ev: KeyDownEvent<any>) {
        const settings = ev.payload.settings;
        const url = settings.webhookUrl;
        const method = settings.method || 'GET';
        const bodyStr = settings.body;

        if (!url) {
            streamDeck.logger.warn("Webhook URL is missing");
            await ev.action.showAlert();
            return;
        }

        let body;
        if (bodyStr) {
            try {
                body = JSON.parse(bodyStr);
            } catch (e) {
                streamDeck.logger.error("Invalid JSON body");
                await ev.action.showAlert();
                return;
            }
        }

        try {
            streamDeck.logger.info(`Triggering webhook ${url}`);
            const result = await n8nApi.triggerWebhook(url, method, body, {
                authType: settings.authType || 'none',
                authUsername: settings.authUsername,
                authPassword: settings.authPassword,
                authHeaderName: settings.authHeaderName,
                authHeaderValue: settings.authHeaderValue,
                authJwtToken: settings.authJwtToken
            });
            streamDeck.logger.info("Webhook result:", JSON.stringify(result));
            await ev.action.showOk();
        } catch (error) {
            streamDeck.logger.error(`Failed to trigger webhook: ${error}`);
            await ev.action.showAlert();
        }
    }
}
