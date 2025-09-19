import type { Action } from "@/lib/types";

console.log("Flow runner injected");

chrome.runtime.onMessage.addListener(
	async (message, _sender, _sendResponse) => {
		if (message.type === "EXECUTE_FLOW") {
			const actions = message.payload;
			await runFlow(actions);
			console.log("flow completed");
			chrome.runtime.sendMessage({ type: "EXECUTION_COMPLETE" });
		}
	}
);

async function runFlow(actions: Action[]) {
	for (const action of actions) {
		switch (action.actionType) {
			case "click":
				if (!action.path) break;
				await new Promise((resolve) => setTimeout(resolve, 2500));
				await click(action.path);
				break;
			case "type":
				console.log("Not implemented");
				break;
			case "navigate":
				// window.location.href = action.url;
				console.log("Not implemented");
				break;
			default:
				console.warn("Unknown action type:", action.actionType);
		}
	}
}

async function click(cssPath: string) {
	const el = document.querySelector(cssPath);
	console.log("clicking on", el);
	if (!el) return;
	// Create the event
	const event = new MouseEvent("click", {
		bubbles: true,
		cancelable: true,
		view: window,
	});

	// Dispatch the event on the element
	el.dispatchEvent(event);
}

// async function waitAndType(cssPath, text) {
//   const el = await waitForElement(selector);
//   el.value = text;
//   el.dispatchEvent(new Event("input", { bubbles: true }));
//   console.log("Typed into:", selector, "→", text);
// }
