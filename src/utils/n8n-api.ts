import streamDeck from "@elgato/streamdeck";

export interface N8nGlobalSettings {
    baseUrl?: string;
    apiKey?: string;
}

export class N8nApi {
    private async getSettings(): Promise<N8nGlobalSettings> {
        return await streamDeck.settings.getGlobalSettings() as N8nGlobalSettings;
    }

    private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
        const settings = await this.getSettings();

        if (!settings.baseUrl || !settings.apiKey) {
            throw new Error("Missing n8n configuration. Please check plugin settings.");
        }

        // Ensure URL doesn't have trailing slash for consistency
        const baseUrl = settings.baseUrl.replace(/\/$/, "");
        const url = `${baseUrl}${endpoint}`;

        const headers = {
            "X-N8N-API-KEY": settings.apiKey,
            "Content-Type": "application/json",
            ...options.headers,
        };

        // Local debug log
        console.log(`[N8N] Requesting: ${url}`);

        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const text = await response.text();
            console.error(`[N8N] Error requesting ${url}: ${response.status} - ${text}`);
            throw new Error(`n8n API Error ${response.status} at ${url}: ${text}`);
        }

        try {
            return await response.json();
        } catch (e) {
            return {}; // Return empty object if json parse fails (e.g. 204 response)
        }
    }

    async executeWorkflow(id: string): Promise<any> {
        return this.request(`/api/v1/workflows/${id}/execute`, {
            method: 'POST'
        });
    }

    async triggerWebhook(url: string, method: string = 'POST', body?: any, auth?: {
        authType: string;
        authUsername?: string;
        authPassword?: string;
        authHeaderName?: string;
        authHeaderValue?: string;
        authJwtToken?: string;
    }): Promise<any> {
        let fetchUrl = url.trim();
        if (!fetchUrl.match(/^https?:\/\//i)) {
            fetchUrl = `http://${fetchUrl}`;
        }

        console.log(`[N8N] Triggering Webhook: ${method} ${fetchUrl}`);

        const headers: Record<string, string> = {
            "Content-Type": "application/json"
        };

        // Apply Authentication
        if (auth) {
            switch (auth.authType) {
                case 'basic':
                    if (auth.authUsername && auth.authPassword) {
                        const credentials = Buffer.from(`${auth.authUsername}:${auth.authPassword}`).toString('base64');
                        headers['Authorization'] = `Basic ${credentials}`;
                        console.log(`[N8N] Applied Basic Auth`);
                    }
                    break;
                case 'header':
                    if (auth.authHeaderName && auth.authHeaderValue) {
                        headers[auth.authHeaderName] = auth.authHeaderValue;
                        console.log(`[N8N] Applied Header Auth: ${auth.authHeaderName}`);
                    }
                    break;
                case 'jwt':
                    if (auth.authJwtToken) {
                        headers['Authorization'] = `Bearer ${auth.authJwtToken}`;
                        console.log(`[N8N] Applied JWT Auth`);
                    }
                    break;
            }
        }

        if (body) console.log(`[N8N] Webhook Body: ${JSON.stringify(body)}`);

        // Perform the request
        try {
            const response = await fetch(fetchUrl, {
                method: method,
                headers: headers,
                body: body ? JSON.stringify(body) : undefined
            });

            if (!response.ok) {
                const text = await response.text();
                console.error(`[N8N] Webhook Failed ${response.status}: ${text}`);
                throw new Error(`Webhook Error ${response.status}: ${text}`);
            }

            const json = await response.json().catch(() => ({}));
            console.log(`[N8N] Webhook Success:`, json);
            return json;
        } catch (error: any) {
            console.error(`[N8N] Network/Fetch Error: ${error.message}`);
            throw error;
        }
    }
    async getLatestExecution(workflowId: string): Promise<any> {
        // API: GET /executions?workflowId={id}&limit=1
        // We use the query params to filter by workflowId and limit to 1
        return this.request(`/api/v1/executions?workflowId=${workflowId}&limit=1`, {
            method: 'GET'
        });
    }

    async activateWorkflow(id: string): Promise<any> {
        return this.request(`/api/v1/workflows/${id}/activate`, {
            method: 'POST'
        });
    }

    async deactivateWorkflow(id: string): Promise<any> {
        return this.request(`/api/v1/workflows/${id}/deactivate`, {
            method: 'POST'
        });
    }
}

export const n8nApi = new N8nApi();
