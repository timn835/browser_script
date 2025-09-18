export type ActionType = "click" | "type" | "enter" | "navigate";

export type Action = {
	actionType: ActionType;
	preActionUrl: string; // Url of the tab before the action was performed
	path?: string; // CSS path to the html element if the actionType is "click"
};

export type Flow = {
	id: string;
	title: string;
	timestamp: number;
	actions: Action[];
};

export type BrowserScriptState = {
	flows: Flow[];
	activeFlowId: string | null;
};
