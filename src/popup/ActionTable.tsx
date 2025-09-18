import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import type { Action } from "@/lib/types";
import { CheckIcon, ClipboardIcon } from "lucide-react";
import { useState } from "react";

type ActionTableProps = {
	actions: Action[];
};

export function ActionTable({ actions }: ActionTableProps) {
	const [copiedIdx, setCopiedIdx] = useState<number | undefined>(undefined);
	const handleCopy = async (idx: number, path?: string) => {
		if (path === undefined) return;
		await navigator.clipboard.writeText(path);
		setCopiedIdx(idx);
		setTimeout(() => setCopiedIdx(undefined), 1500);
	};
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="text-left">No.</TableHead>
					<TableHead className="text-left">Type</TableHead>
					<TableHead className="text-left">Pre-action url</TableHead>
					<TableHead className="text-center">Copy CSS Path</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{actions.map(({ actionType, preActionUrl, path }, i) => (
					<TableRow key={i}>
						<TableCell className="text-left">{i + 1}</TableCell>
						<TableCell className="text-left">
							{actionType}
						</TableCell>
						<TableCell className="text-left">
							{preActionUrl}
						</TableCell>
						<TableCell
							className="text-center"
							onClick={async () => await handleCopy(i, path)}>
							<Button
								variant="secondary"
								disabled={path === undefined}>
								{copiedIdx === i ? (
									<CheckIcon className="text-blue-500" />
								) : (
									<ClipboardIcon className="text-blue-500" />
								)}
							</Button>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
