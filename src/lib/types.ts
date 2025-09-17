export type Action = "click" | "type" | "enter" | "navigate";

export type FlowStatus = "ready" | "listening" | "complete";

export type ActionElement = {
	element: Element; // HTML element
	path: string; // CSS path
};

export type BrowserAction = {
	action: Action;
	element?: ActionElement;
};

export type Flow = {
	name: string;
	date: string;
	status: FlowStatus;
	initialUrl: string;
	actions: Action[];
};

export type BrowserScriptState = {
	flows: Flow[];
	listeningIdx?: number;
};
