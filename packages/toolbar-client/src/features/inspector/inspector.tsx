import { InspectorToolbarTrigger } from "@/features/inspector/components/toolbar-trigger";
import {
	type InspectMetadata,
	useInspectorActorRef,
} from "@viweb/code-inspector-web";
import { useEffect } from "react";

export function Inspector() {
	const actorRef = useInspectorActorRef();

	useEffect(() => {
		const subscription = actorRef.subscribe((state) => {
			if (state.matches("inspected")) {
				console.log("inspected1", state.context);
				if (!state.context.inspectedElementMetadata) return;
				window.VIWEB_BROWSER_EXTENSION_API.inspected({
					metadata: state.context.inspectedElementMetadata,
				});
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [actorRef]);

	return <InspectorToolbarTrigger />;
}

declare global {
	interface Window {
		VIWEB_BROWSER_EXTENSION_API: {
			inspected: (data: { metadata: InspectMetadata }) => void;
		};
	}
}
