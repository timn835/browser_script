import { Button } from "@/components/ui/button";
import type { Action, Flow } from "@/lib/types";
import { SaveIcon } from "lucide-react";
import {
	useEffect,
	useState,
	type Dispatch,
	type RefObject,
	type SetStateAction,
} from "react";
import { ActionTable } from "@/popup/ActionTable";

type CreateFlowProps = {
	activeFlowRef: RefObject<Flow>;
	setIsCreatingFlow: Dispatch<SetStateAction<boolean>>;
	setFlows: Dispatch<SetStateAction<Flow[]>>;
};

export function CreateFlow({
	activeFlowRef,
	setIsCreatingFlow,
	setFlows,
}: CreateFlowProps) {
	const [actions, setActions] = useState<Action[]>(
		activeFlowRef.current.actions
	); // Actions of an active flow that may not have been stored yet

	useEffect(() => {
		const handleMessage = (message: any) => {
			if (message.type === "ACTION_CAPTURED") {
				const action: Action = message.payload;
				activeFlowRef.current.actions.push(action);

				// Trigger a re-render of actions
				setActions((prevActions) => [...prevActions, action]);
			}
		};

		// Add listener
		chrome.runtime.onMessage.addListener(handleMessage);

		// Cleanup on unmount
		return () => {
			chrome.runtime.onMessage.removeListener(handleMessage);
		};
	}, []);

	const handleSaveFlow = () => {
		// Send message to background script to complete the active flow and to alert all tabs to stop listening for actions
		chrome.runtime.sendMessage(
			{
				type: "FLOW_CREATED",
			},
			(response) => {
				if (chrome.runtime.lastError) {
					console.error("message error:", chrome.runtime.lastError);
					return;
				}
				if (response?.status === "ok") {
					// Update ui
					setFlows((prevFlows) => {
						const newFlow = { ...activeFlowRef.current };
						// Re-initialize active flow
						activeFlowRef.current = {
							id: "",
							title: "",
							timestamp: 0,
							actions: [],
						};
						return [newFlow, ...prevFlows];
					});
					setIsCreatingFlow(false);
				} else {
					console.error("failed to create flow", response);
				}
			}
		);
	};

	return (
		<>
			<div className="w-full text-center flex justify-center items-center gap-2">
				<h2 className="font-semibold text-xl">
					{activeFlowRef.current.title
						? activeFlowRef.current.title
						: "No title"}
				</h2>
				<span className="w-48">Listening for actions...</span>
				<Button className="w-48" onClick={handleSaveFlow}>
					<SaveIcon /> FLOW
				</Button>
			</div>
			<ActionTable actions={actions} />
		</>
	);
}
