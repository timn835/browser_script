console.log("hello from content script");

// Initialize local listening variable
let listening = false;

// Listen for "click" events and emit click actions
function attachClickListener() {
	document.addEventListener(
		"click",
		(event) => {
			// Check if listening
			if (!listening) return;
			console.log("click detected while listening!!!");

			// Get the url on which the action is performed
			const preActionUrl = window.location.href;

			// Walk back and determine the CSS path of the node
			let selectorArr = []; // An array of strings containing the full path in reverse order
			let el = event.target as Element | null;

			while (el && el.nodeType === Node.ELEMENT_NODE) {
				// Initialize current level selector
				let selector = el.nodeName.toLowerCase();

				if (el.previousElementSibling || el.nextElementSibling) {
					// Update the placement
					let nth = 1;
					while (el.previousElementSibling) {
						el = el.previousElementSibling;
						nth++;
					}
					selector = `${selector}:nth-child(${nth})`;
				}

				selectorArr.push(selector);
				el = el.parentNode instanceof Element ? el.parentNode : null;
			}

			//Send message to background that an action was performed
			chrome.runtime.sendMessage({
				type: "ACTION_CAPTURED",
				payload: {
					actionType: "click",
					preActionUrl,
					path: selectorArr.reverse().join(" > "),
				},
			});
		},
		true // this is to catch the event before it bubbles up
	);
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
	if (!message || !message.type) return;

	if (message.type === "START_LISTENING") {
		listening = true;
		console.log("Content script is now listening for clicks.");
		return;
	}
	if (message.type === "STOP_LISTENING") {
		listening = false;
		console.log("Content has stopped listening for clicks.");
	}
});

// Send a message to background to see if we should be listening
chrome.runtime.sendMessage({ type: "CHECK_ACTIVE_FLOW" }, (response) => {
	if (chrome.runtime.lastError) {
		console.error("Error checking active flow:", chrome.runtime.lastError);
		return;
	}
	if (response?.status === "ok") {
		if (response.activeFlow === null) return;
		listening = true;
		console.log("Content script is now listening for clicks.");
	}
});

if (document.readyState === "complete") {
	attachClickListener();
} else {
	window.addEventListener("load", attachClickListener, { once: true });
}

// function simulateClick(el) {
// 	if (!el) return;

// 	// Create the event
// 	const event = new MouseEvent("click", {
// 		bubbles: true,
// 		cancelable: true,
// 		view: window,
// 	});

// 	// Dispatch the event on the element
// 	el.dispatchEvent(event);
// }
