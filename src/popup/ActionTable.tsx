import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import type { Action } from "@/lib/types";

type ActionTableProps = {
	actions: Action[];
};

export function ActionTable({ actions }: ActionTableProps) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="text-left">No.</TableHead>
					<TableHead className="text-left">Type</TableHead>
					<TableHead className="text-left">Pre-action url</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{actions.map(({ actionType, preActionUrl }, i) => (
					<TableRow key={i}>
						<TableCell className="text-left">{i + 1}</TableCell>
						<TableCell className="text-left">
							{actionType}
						</TableCell>
						<TableCell className="text-left">
							{preActionUrl}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
