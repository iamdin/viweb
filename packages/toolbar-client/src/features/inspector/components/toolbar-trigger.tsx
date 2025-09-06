import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	useInspectorActorRef,
	useInspectorActorSelector,
} from "@viweb/code-inspector-web";
import { MousePointerClickIcon } from "lucide-react";

export const InspectorToolbarTrigger = () => {
	const inspecting = useInspectorActorSelector((state) =>
		state.matches("inspecting"),
	);
	const actorRef = useInspectorActorRef();
	return (
		<Button
			variant="ghost"
			size="icon"
			className={cn(
				"rounded-3xl size-8",
				inspecting && "bg-primary text-primary-foreground",
			)}
			onClick={() => {
				if (!inspecting) actorRef.send({ type: "START" });
				else actorRef.send({ type: "STOP" });
			}}
		>
			<MousePointerClickIcon />
		</Button>
	);
};
