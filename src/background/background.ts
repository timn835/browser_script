import type { Action, Flow } from "@/lib/types";

console.log("Hello from BrowserScript background!");

// Initialize storage on extension install
chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.sync.get(["flows", "activeFlowId"], (res) => {
		console.log(
			"extension installed, flows are",
			res.flows,
			"activeFlowId is",
			res.activeFlowId
		);
		// if we already have an array of flows and not actively listening, return
		if ("flows" in res && res.activeFlowId === null) return;
		chrome.storage.sync.set({
			flows: "flows" in res ? res.flows : [],
			activeFlowId: null,
		});
	});
});

// Create an in-memory variable to keep track of an active flow
// @ts-ignore
let activeFlow: Flow | null = null; // in-memory active flow reference

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
	if (!message || !message.type) return;

	// Popup check if there is an activeFlow
	if (message.type === "CHECK_ACTIVE_FLOW") {
		console.log(
			"background received CHECK_ACTIVE_FLOW message, activeFlow is:",
			activeFlow
		);
		sendResponse({ status: "ok", activeFlow });
	}

	// Initiate the flow
	if (message.type === "INITIATE_FLOW") {
		console.log(
			"background received INITIATE_FLOW message, message payload is:",
			message.payload
		);
		const { id, timestamp, title } = message.payload;

		// Initialize flow in memory
		activeFlow = {
			id,
			timestamp,
			title,
			actions: [],
		};

		// Send START_LISTENING to all tabs with content scripts
		chrome.tabs.query({}, (tabs) => {
			for (const tab of tabs) {
				if (!tab.id) continue;
				chrome.tabs.sendMessage(
					tab.id,
					{ type: "START_LISTENING" },
					() => {
						if (chrome.runtime.lastError) {
							console.log(
								"Tab has no listener:",
								chrome.runtime.lastError.message
							);
						}
					}
				);
			}
		});

		// Reply to popup that flow was created
		sendResponse({ status: "ok" });
		return;
	}

	// Complete and store the flow
	if (message.type === "COMPLETE_FLOW") {
		console.log(
			"background received COMPLETE_FLOW message, activeFlow is:",
			activeFlow
		);
		// Check if we have a flow
		if (activeFlow === null) return;

		// Store the flow
		chrome.storage.sync.get(["flows"], (res) => {
			chrome.storage.sync.set({
				flows: [activeFlow, ...res.flows],
				activeFlow: null,
			});
		});

		// Send STOP_LISTENING to all tabs with content scripts
		chrome.tabs.query({}, (tabs) => {
			for (const tab of tabs) {
				if (!tab.id) continue;
				chrome.tabs.sendMessage(
					tab.id,
					{ type: "STOP_LISTENING" },
					() => {
						if (chrome.runtime.lastError) {
							console.log(
								"Tab has no listener:",
								chrome.runtime.lastError.message
							);
						}
					}
				);
			}
		});

		// Reply to popup that flow was created
		sendResponse({ status: "ok" });
		return;
	}

	if (message.type === "ACTION_CAPTURED") {
		console.log(
			"background received ACTION_CAPTURED message, message payload is:",
			message.payload
		);
		if (!activeFlow) return;
		const action: Action = message.payload;

		// Add the action to the local activeFlow
		activeFlow.actions.push(action);
	}
});

// chrome.webRequest.onBeforeSendHeaders.addListener(
// 	(details) => {
// 		console.log("Request ID:", details.requestId);
// 		console.log("Request URL:", details.url);
// 		console.log("Request headers:", details.requestHeaders);
// 	},
// 	{ urls: ["<all_urls>"] },
// 	["requestHeaders", "extraHeaders"]
// );

// chrome.webRequest.onHeadersReceived.addListener(
// 	(details) => {
// 		console.log("Response ID:", details.requestId);
// 		console.log("Response URL:", details.url);
// 		console.log("Response headers:", details.responseHeaders);
// 	},
// 	{ urls: ["<all_urls>"] },
// 	["responseHeaders", "extraHeaders"]
// );
