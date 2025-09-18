import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Flow } from "@/lib/types";
import { CreateFlow } from "@/popup/CreateFlow";
import { FlowTable } from "@/popup/FlowTable";
import { PlusIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function Popup() {
	const [isCreatingFlow, setIsCreatingFlow] = useState<boolean>(false);
	const activeFlowRef = useRef<Flow>({
		id: "",
		title: "",
		timestamp: 0,
		actions: [],
	});
	const [flows, setFlows] = useState<Flow[]>([]);

	useEffect(() => {
		console.log("Popup useEffect running");

		// Get the flows from storage on component mount
		chrome.storage.sync.get(["flows"], (result) => {
			console.log("Popup useEffect fetched storage", result);
			if (result.flows) setFlows(result.flows);
		});

		// Get the activeFlow from background
		chrome.runtime.sendMessage(
			{ type: "CHECK_ACTIVE_FLOW" },
			(response) => {
				console.log("Popup useEffect checked active flow", response);
				if (chrome.runtime.lastError) {
					console.error(
						"Error checking active flow:",
						chrome.runtime.lastError
					);
					return;
				}
				if (response?.status === "ok") {
					if (response.activeFlow === null) return;
					// Update the ui according to the active flow
					const { id, title, timestamp, actions } =
						response.activeFlow as Flow;
					activeFlowRef.current = { id, title, timestamp, actions };
					setIsCreatingFlow(true);
				}
			}
		);
	}, []);

	const handleCreateFlow = () => {
		// Create id and timestamp for the new flow
		activeFlowRef.current.id = crypto.randomUUID();
		activeFlowRef.current.timestamp = new Date().getTime();

		// Send message to background script to initialize a flow and to alert all tabs to start listening for actions
		chrome.runtime.sendMessage(
			{
				type: "INITIATE_FLOW",
				payload: { ...activeFlowRef.current },
			},
			(response) => {
				console.log("Popup created message", response);
				if (chrome.runtime.lastError) {
					console.error(
						"Error initiating flow:",
						chrome.runtime.lastError
					);
					return;
				}
				if (response?.status === "ok") {
					// Update ui
					setIsCreatingFlow(true);
				} else {
					console.error("failed to create flow", response);
				}
			}
		);
	};

	return (
		<div className="w-full text-center space-y-4 p-4">
			{isCreatingFlow ? (
				<CreateFlow
					activeFlowRef={activeFlowRef}
					setIsCreatingFlow={setIsCreatingFlow}
					setFlows={setFlows}
				/>
			) : (
				<>
					<div className="w-full text-center flex justify-center items-center gap-2">
						<Input
							className="w-48"
							placeholder="Enter flow title..."
							defaultValue={activeFlowRef.current.title}
							onChange={(v) => {
								activeFlowRef.current.title =
									v.currentTarget.value;
							}}
						/>
						<Button className="w-48" onClick={handleCreateFlow}>
							<PlusIcon /> NEW FLOW
						</Button>
					</div>
					<div className="w-full text-center">
						<h2 className="font-semibold text-xl">Your flows:</h2>
						<FlowTable flows={flows} />
					</div>
				</>
			)}
		</div>
	);
}
