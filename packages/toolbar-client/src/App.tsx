import { Toolbar } from "@/components/toolbar";
import { Button } from "@/components/ui/button";
import { Inspector } from "@/features/inspector/inspector";
import { useConnect } from "@/hooks/use-connect";
import { Loader2Icon, RefreshCwIcon } from "lucide-react";

export function ToolbarIndicator() {
	const { connecting, connected, error, reconnect } = useConnect();

	if (connecting) {
		return (
			<Toolbar loading={true} error={null}>
				<Button variant="ghost" onClick={reconnect} className="rounded-3xl">
					<Loader2Icon className="animate-spin size-4" />
					<p className="text-xs text-muted-foreground/90">Connecting...</p>
				</Button>
			</Toolbar>
		);
	}

	if (error || connected === false) {
		return (
			<Toolbar loading={false} error={error}>
				<Button
					variant="destructive"
					onClick={reconnect}
					className="rounded-3xl cursor-pointer"
				>
					<RefreshCwIcon className="size-4" />
					Error
				</Button>
			</Toolbar>
		);
	}

	return (
		<>
			<Toolbar loading={false} error={null}>
				<div className="flex items-center gap-2 p-1">
					<Inspector />
				</div>
			</Toolbar>
		</>
	);
}
