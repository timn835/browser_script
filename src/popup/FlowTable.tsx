import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { Flow } from "@/lib/types";
import { RefreshCcwIcon, TimerIcon, Trash2Icon } from "lucide-react";

// const flows: Flow[] = [
// 	{
// 		id: crypto.randomUUID(),
// 		name: "Image download",
// 		date: "2025-09-17T03:12:53.273Z",
// 		initialUrl: "www.google.com",
// 		actions: [],
// 	},
// 	{
// 		id: crypto.randomUUID(),
// 		name: "Excel download",
// 		date: "2025-09-16T03:12:53.273Z",
// 		initialUrl: "www.insight-hawk.com",
// 		actions: [],
// 	},
// 	{
// 		id: crypto.randomUUID(),
// 		name: "Facebook scrape",
// 		date: "2025-09-15T03:12:53.273Z",
// 		initialUrl: "www.facebook.com",
// 		actions: [],
// 	},
// ];

type FlowTableProps = {
	flows: Flow[];
};

export function FlowTable({ flows }: FlowTableProps) {
	console.log("ffuuuuck", flows, flows[0]?.actions?.length);
	if (!flows.length) return <p>You have yet to create any flows</p>;
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="text-left">Name</TableHead>
					<TableHead className="text-left">Created On</TableHead>
					<TableHead className="text-center"># of Actions</TableHead>
					<TableHead className="text-center">Run</TableHead>
					<TableHead className="text-center">Schedule</TableHead>
					<TableHead className="text-center">Delete</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{flows.map(({ id, title, timestamp, actions }) => (
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
								<TimerIcon />
							</Button>
						</TableCell>
						<TableCell className="text-center">
							<Button className="w-12" variant="destructive">
								<Trash2Icon />
							</Button>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
