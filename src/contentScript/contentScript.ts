console.log("hello from content script");

// Initialize local listening variable
let listening = false;

// Get initial value
chrome.storage.sync.get("listening", (res) => {
	listening = res.listening === true;
});

// Watch for changes in listening
chrome.storage.onChanged.addListener((changes, area) => {
	if (area === "sync" && "listening" in changes) {
		listening = changes.listening.newValue === true;
	}
});

document.addEventListener("click", (event) => {
	// Check if listening
	if (!listening) return;

	// Walk back and determine the path of the node
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

	const fullSelector = selectorArr.reverse().join(" > ");
	console.log(fullSelector);

	// Perform a sanity check
	const found = document.querySelector(fullSelector);
	if (found === event.target) console.log("all good brah");
	else console.log("NOOOO!", found, event.target);
});

/**
#reddit-recent-searches-partial-container > faceplate-tracker:nth-child(4) > faceplate-tracker > li > a > span.flex.items-center.gap-xs.min-w-0.shrink > span.flex.flex-col.justify-center.min-w-0.shrink.py-\[var\(--rem6\)\] > span.text-14 > div > div
 */

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
