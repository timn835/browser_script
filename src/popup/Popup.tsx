import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { Flow } from "@/lib/types";
import {
	PlayIcon,
	RefreshCcwIcon,
	SquareIcon,
	TimerIcon,
	Trash2Icon,
} from "lucide-react";

const flows: Flow[] = [
	{
		name: "Image download",
		date: "2025-09-17T03:12:53.273Z",
		status: "ready",
		initialUrl: "www.google.com",
		actions: [],
	},
	{
		name: "Excel download",
		date: "2025-09-16T03:12:53.273Z",
		status: "listening",
		initialUrl: "www.insight-hawk.com",
		actions: [],
	},
	{
		name: "Facebook scrape",
		date: "2025-09-15T03:12:53.273Z",
		status: "complete",
		initialUrl: "www.facebook.com",
		actions: [],
	},
];

export function Popup() {
	return (
		<div className="w-full text-center space-y-4">
			<h1 className="text-center font-bold text-xl">
				Welcome to BrowserScript!
			</h1>
			<div className="w-full text-center flex justify-center items-center gap-2">
				<Input className="w-48" placeholder="Enter flow title..." />
				<Button>CREATE NEW FLOW</Button>
			</div>
			<div className="w-full text-center">
				<h2 className="font-semibold text-lg">Your existing flows:</h2>
				{flows.length === 0 ? (
					<p>You have yet to create any flows</p>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="text-left">
									Name
								</TableHead>
								<TableHead className="text-left">
									Created On
								</TableHead>
								<TableHead className="text-left">
									Status
								</TableHead>
								<TableHead className="text-left">
									# of Actions
								</TableHead>
								<TableHead className="text-left">
									Listen
								</TableHead>
								<TableHead className="text-left">Run</TableHead>
								<TableHead className="text-left">
									Schedule
								</TableHead>
								<TableHead className="text-left">
									Delete
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{flows.map(({ name, date, status, actions }) => (
								<TableRow key={date}>
									<TableCell className="text-left">
										{name}
									</TableCell>
									<TableCell className="text-left">
										{new Date(date).toLocaleString()}
									</TableCell>
									<TableCell className="text-left">
										{status === "ready"
											? "Ready!"
											: status === "listening"
											? "Listening..."
											: "Complete"}
									</TableCell>
									<TableCell className="text-center">
										{actions.length}
									</TableCell>
									<TableCell className="text-left">
										<Button
											className="w-12"
											disabled={status === "complete"}>
											{status === "complete" ? (
												"Stopped"
											) : status === "ready" ? (
												<PlayIcon className="text-green-500" />
											) : (
												<SquareIcon className="text-red-500" />
											)}
										</Button>
									</TableCell>
									<TableCell className="text-left">
										<Button
											className="w-12"
											disabled={status !== "complete"}>
											<RefreshCcwIcon />
										</Button>
									</TableCell>
									<TableCell className="text-left">
										<Button
											className="w-12"
											disabled={status !== "complete"}>
											<TimerIcon />
										</Button>
									</TableCell>
									<TableCell className="text-left">
										<Button
											className="w-12"
											variant="destructive">
											<Trash2Icon />
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</div>
		</div>
	);
}
