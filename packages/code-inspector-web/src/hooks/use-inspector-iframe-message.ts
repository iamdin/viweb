import { createBirpc } from "birpc";
import { useEffect, useMemo } from "react";
import { useInspectorActorRef } from "../context";
import type { ClientFunctions, ServerFunctions } from "../lib/message";
import { MESSAGE_TYPES } from "../lib/message/constants";
import { createServerBirpcOption } from "../lib/message/server";

export function useInspectorIframeMessage() {
	const inspectActorRef = useInspectorActorRef();

	const serverFunctions = useMemo(
		() =>
			({
				healthCheck: async () => true,
				inspectorStart: async () => {
					inspectActorRef.send({ type: "START" });
				},
				inspectorStop: async () => {
					inspectActorRef.send({ type: "STOP" });
				},
			}) satisfies ServerFunctions,
		[inspectActorRef],
	);

	// Create RPC connection immediately
	const clientRPC = useMemo(() => {
		return createBirpc<ClientFunctions, ServerFunctions>(
			serverFunctions,
			createServerBirpcOption(),
		);
	}, [serverFunctions]);

	// MessageChannel setup effect
	useEffect(() => {
		// Immediately signal to parent that iframe is ready
		window.parent.postMessage({ type: MESSAGE_TYPES.IFRAME_READY }, "*");
	}, []);

	// Inspector actor subscription effect
	useEffect(() => {
		const subscription = inspectActorRef.subscribe((state) => {
			if (state.matches("inspected")) {
				if (!state.context.inspectedElementMetadata) return;
				if (!state.context.inspectedElement) return;
				clientRPC?.inspectorInspected({
					dataset: state.context.inspectedElementDataset,
					metadata: state.context.inspectedElementMetadata,
				});
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [inspectActorRef, clientRPC]); // Depends on inspectActorRef
}
