let websocket = null;
let uuid = null;
let actionInfo = null;

function connectElgatoStreamDeckSocket(inPort, inPropertyInspectorUUID, inRegisterEvent, inInfo, inActionInfo) {
    uuid = inPropertyInspectorUUID;
    actionInfo = JSON.parse(inActionInfo);

    websocket = new WebSocket('ws://127.0.0.1:' + inPort);

    websocket.onopen = function () {
        // Register property inspector
        const json = {
            event: inRegisterEvent,
            uuid: inPropertyInspectorUUID
        };
        websocket.send(JSON.stringify(json));

        // Request global settings
        getGlobalSettings();

        // Reveal correct fields based on UUID
        const actionId = actionInfo.action;
        if (actionId === 'com.oscarnava.n8n.trigger' ||
            actionId === 'com.oscarnava.n8n.status' ||
            actionId === 'com.oscarnava.n8n.activate' ||
            actionId === 'com.oscarnava.n8n.deactivate') {
            document.getElementById('workflowSettings').style.display = 'block';
        } else if (actionId === 'com.oscarnava.n8n.webhook') {
            document.getElementById('webhookSettings').style.display = 'block';
        }

        // Populate local settings
        const settings = actionInfo.payload.settings;
        if (settings) {
            updateUI(settings);
        }
    };

    websocket.onmessage = function (evt) {
        const jsonObj = JSON.parse(evt.data);
        const event = jsonObj.event;

        if (event === 'didReceiveGlobalSettings') {
            const settings = jsonObj.payload.settings;
            if (settings) {
                if (settings.baseUrl) document.getElementById('baseUrl').value = settings.baseUrl;
                if (settings.apiKey) document.getElementById('apiKey').value = settings.apiKey;
            }
        } else if (event === 'didReceiveSettings') {
            const settings = jsonObj.payload.settings;
            updateUI(settings);
        }
    };
}

function updateUI(settings) {
    if (settings.workflowId) document.getElementById('workflowId').value = settings.workflowId;
    if (settings.webhookUrl) document.getElementById('webhookUrl').value = settings.webhookUrl;
    if (settings.method) document.getElementById('method').value = settings.method;
    if (settings.body) document.getElementById('body').value = settings.body;

    // Auth fields
    if (settings.authType) {
        document.getElementById('authType').value = settings.authType;
        toggleAuthFields(settings.authType);
    }
    if (settings.authUsername) document.getElementById('authUsername').value = settings.authUsername;
    if (settings.authPassword) document.getElementById('authPassword').value = settings.authPassword;
    if (settings.authHeaderName) document.getElementById('authHeaderName').value = settings.authHeaderName;
    if (settings.authHeaderValue) document.getElementById('authHeaderValue').value = settings.authHeaderValue;
    if (settings.authJwtToken) document.getElementById('authJwtToken').value = settings.authJwtToken;
}

function toggleAuthFields(type) {
    document.getElementById('basicAuthSettings').style.display = type === 'basic' ? 'block' : 'none';
    document.getElementById('headerAuthSettings').style.display = type === 'header' ? 'block' : 'none';
    document.getElementById('jwtAuthSettings').style.display = type === 'jwt' ? 'block' : 'none';
}

function getGlobalSettings() {
    const json = {
        event: 'getGlobalSettings',
        context: uuid
    };
    websocket.send(JSON.stringify(json));
}

function updateGlobal() {
    const baseUrl = document.getElementById('baseUrl').value;
    const apiKey = document.getElementById('apiKey').value;

    const json = {
        event: 'setGlobalSettings',
        context: uuid,
        payload: {
            baseUrl: baseUrl,
            apiKey: apiKey
        }
    };
    websocket.send(JSON.stringify(json));
}

function updateAction() {
    const workflowId = document.getElementById('workflowId').value;
    const webhookUrl = document.getElementById('webhookUrl').value;
    const method = document.getElementById('method').value;
    const body = document.getElementById('body').value;

    // New Auth fields
    const authType = document.getElementById('authType').value;
    toggleAuthFields(authType);

    const payload = {
        workflowId: workflowId,
        webhookUrl: webhookUrl,
        method: method,
        body: body,
        authType: authType,
        authUsername: document.getElementById('authUsername').value,
        authPassword: document.getElementById('authPassword').value,
        authHeaderName: document.getElementById('authHeaderName').value,
        authHeaderValue: document.getElementById('authHeaderValue').value,
        authJwtToken: document.getElementById('authJwtToken').value
    };

    const json = {
        event: 'setSettings',
        context: uuid,
        payload: payload
    };
    websocket.send(JSON.stringify(json));
}
