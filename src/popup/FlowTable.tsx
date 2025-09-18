import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { Flow } from "@/lib/types";
import { ArrowRightIcon, RefreshCcwIcon, Trash2Icon } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";

type FlowTableProps = {
	flows: Flow[];
	setFlows: Dispatch<SetStateAction<Flow[]>>;
};

export function FlowTable({ flows, setFlows }: FlowTableProps) {
	const [deleteIdx, setDeleteIdx] = useState<number | undefined>();

	if (!flows.length) return <p>You have yet to create any flows</p>;
	const handleDeleteFlow = (i: number) => {
		const newFlows = flows.filter((_, j) => i !== j);
		// Adjust chrome storage
		chrome.storage.sync.set({ flows: newFlows });

		// Adjust popup ui
		setFlows(newFlows);
	};
	return (
		<>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="text-left">Name</TableHead>
						<TableHead className="text-left">Created On</TableHead>
						<TableHead className="text-center">
							# of Actions
						</TableHead>
						<TableHead className="text-center">Run</TableHead>
						<TableHead className="text-center">View</TableHead>
						<TableHead className="text-center">Delete</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{flows.map(({ id, title, timestamp, actions }, i) => (
						<TableRow key={id}>
							<TableCell className="text-left">{title}</TableCell>
							<TableCell className="text-left">
								{new Date(timestamp).toLocaleString()}
							</TableCell>
							<TableCell className="text-center">
								{actions.length}
							</TableCell>
							<TableCell className="text-center">
								<Button className="w-12">
									<RefreshCcwIcon />
								</Button>
							</TableCell>
							<TableCell className="text-center">
								<Button className="w-12">
									<ArrowRightIcon />
								</Button>
							</TableCell>
							<TableCell className="text-center">
								<Button
									className="w-12"
									variant="destructive"
									onClick={() => setDeleteIdx(i)}>
									<Trash2Icon />
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<Dialog
				open={deleteIdx !== undefined}
				onOpenChange={(open) => {
					if (!open) setDeleteIdx(undefined);
				}}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Are you absolutely sure?</DialogTitle>
						<DialogDescription>
							This action cannot be undone. This will permanently
							delete the flow "
							{deleteIdx === undefined
								? ""
								: flows[deleteIdx].title}
							"
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="flex flex-row gap-2 justify-center items-center">
						<DialogClose asChild>
							<Button
								type="button"
								variant="secondary"
								className="w-28">
								Cancel
							</Button>
						</DialogClose>
						<DialogClose asChild>
							<Button
								type="button"
								variant="destructive"
								className="w-28"
								onClick={() => {
									if (deleteIdx !== undefined)
										handleDeleteFlow(deleteIdx);
								}}>
								Proceed
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
