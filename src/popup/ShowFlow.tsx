import { Button } from "@/components/ui/button";
import type { Flow } from "@/lib/types";
import type { Dispatch, SetStateAction } from "react";
import { ActionTable } from "@/popup/ActionTable";
import { ArrowLeftToLineIcon } from "lucide-react";

type ShowFlowProps = {
	setShowingFlowId: Dispatch<SetStateAction<string>>;
	flow?: Flow;
};

export function ShowFlow({ flow, setShowingFlowId }: ShowFlowProps) {
	return (
		<>
			<div className="w-full text-center flex justify-between items-center gap-2">
				<h2 className="font-semibold text-xl">
					{flow?.title ? flow.title : "No title"}
				</h2>
				<Button className="w-24" onClick={() => setShowingFlowId("")}>
					<ArrowLeftToLineIcon />
				</Button>
			</div>
			<ActionTable actions={flow?.actions || []} />
		</>
	);
}
