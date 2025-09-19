import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Flow } from "@/lib/types";
import { CreateFlow } from "@/popup/CreateFlow";
import { FlowTable } from "@/popup/FlowTable";
import { PlusIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ShowFlow } from "@/popup/ShowFlow";

export function Popup() {
	const [isCreatingFlow, setIsCreatingFlow] = useState<boolean>(false);
	const [flows, setFlows] = useState<Flow[]>([]);
	const [showingFlowId, setShowingFlowId] = useState<string>("");
	const activeFlowRef = useRef<Flow>({
		id: "",
		title: "",
		timestamp: 0,
		actions: [],
	});

	// This useEffect will make sure we render what is in storage & if we are already in listening mode
	useEffect(() => {
		chrome.storage.sync.get(["flows"], (result) => {
			if (result.flows) setFlows(result.flows);
		});

		// Get the activeFlow from background
		chrome.runtime.sendMessage(
			{ type: "CHECK_ACTIVE_FLOW" },
			(response) => {
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
				type: "CREATE_FLOW",
				payload: { ...activeFlowRef.current },
			},
			(response) => {
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

	if (isCreatingFlow)
		return (
			<div className="w-full text-center space-y-4 p-4">
				<CreateFlow
					activeFlowRef={activeFlowRef}
					setIsCreatingFlow={setIsCreatingFlow}
					setFlows={setFlows}
				/>
			</div>
		);

	return (
		<div className="w-full text-center space-y-4 p-4">
			{showingFlowId ? (
				<ShowFlow
					flow={flows.find(({ id }) => id === showingFlowId)}
					setShowingFlowId={setShowingFlowId}
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
						<FlowTable
							flows={flows}
							setFlows={setFlows}
							setShowingFlowId={setShowingFlowId}
						/>
					</div>
				</>
			)}
		</div>
	);
}
