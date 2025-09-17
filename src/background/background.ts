console.log("Hello from ScripScrap background woot woot!");

// Initialize storage
chrome.runtime.onInstalled.addListener((details) => {
	console.log(details);
	chrome.storage.sync.get(["listening"], (res) => {
		if ("listening" in res) return;
		chrome.storage.sync.set({ listening: false });
	});
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
