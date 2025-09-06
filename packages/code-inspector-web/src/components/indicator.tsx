import {
	autoUpdate,
	flip,
	offset,
	shift,
	useFloating,
} from "@floating-ui/react";
import { Trash2Icon } from "lucide-react";
import { useEffect } from "react";
import { useInspectorActorRef, useInspectorActorSelector } from "../context";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

function useInspectorFloating(element: HTMLElement | null) {
	const { refs, floatingStyles } = useFloating({
		open: Boolean(element),
		strategy: "fixed",
		placement: "top-start",
		middleware: [offset(8), shift({ padding: 10 }), flip()],
		whileElementsMounted: autoUpdate,
	});

	useEffect(() => {
		if (element) {
			refs.setReference(element);
		}
	}, [refs, element]);

	return { refs, floatingStyles };
}

function CurrentElementIndicator() {
	const currentElement = useInspectorActorSelector(
		(state) => state.context.currentElement,
	);
	const currentElementRect = useInspectorActorSelector(
		(state) => state.context.currentElementRect,
	);
	const currentElementMetadata = useInspectorActorSelector(
		(state) => state.context.currentElementMetadata,
	);
	const inspectedElement = useInspectorActorSelector(
		(state) => state.context.inspectedElement,
	);

	const { refs, floatingStyles } = useInspectorFloating(currentElement || null);

	if (!currentElementRect || currentElement === inspectedElement) return null;

	return (
		<>
			<div
				className="fixed z-[2147483645] border-2 border-blue-500 rounded-lg pointer-events-none"
				style={{
					left: currentElementRect.left,
					top: currentElementRect.top,
					width: currentElementRect.width,
					height: currentElementRect.height,
				}}
			/>
			{!!currentElementMetadata && (
				<div
					ref={refs.setFloating}
					style={floatingStyles}
					className="z-[2147483646] pointer-events-none"
				>
					<Badge
						variant="default"
						className="bg-blue-500 text-white border-blue-500 rounded"
					>
						{currentElementMetadata.componentName}
					</Badge>
				</div>
			)}
		</>
	);
}

function InspectedElementIndicator() {
	const actorRef = useInspectorActorRef();
	const inspectedElementRect = useInspectorActorSelector(
		(state) => state.context.inspectedElementRect,
	);
	const inspectedElementMetadata = useInspectorActorSelector(
		(state) => state.context.inspectedElementMetadata,
	);
	const inspectedElement = useInspectorActorSelector(
		(state) => state.context.inspectedElement,
	);

	const { refs, floatingStyles } = useInspectorFloating(
		inspectedElement || null,
	);

	if (!inspectedElementRect) return null;

	return (
		<>
			<div
				className="fixed z-[2147483644] border-2 border-emerald-500 rounded-xl pointer-events-none"
				style={{
					left: inspectedElementRect.left,
					top: inspectedElementRect.top,
					width: inspectedElementRect.width,
					height: inspectedElementRect.height,
				}}
			/>
			<div
				ref={refs.setFloating}
				style={floatingStyles}
				className="z-[2147483647] flex items-center gap-1 pointer-events-auto"
			>
				<Badge
					variant="default"
					className="bg-emerald-500 text-white border-emerald-500 rounded"
				>
					{inspectedElementMetadata?.componentName || "Unknown"}
				</Badge>
				<Button
					type="button"
					onClick={(event) => {
						actorRef.send({ type: "DELETE_INSPECTED" });
						event.stopPropagation();
					}}
					title="Remove inspection"
					variant="ghost"
					size="sm"
					className="h-5 w-5 p-0 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
				>
					<Trash2Icon className="w-3 h-3" />
				</Button>
			</div>
		</>
	);
}

export function InspectorIndicator() {
	const isIdle = useInspectorActorSelector((state) => state.matches("idle"));

	if (isIdle) return null;
	return (
		<>
			<CurrentElementIndicator />
			<InspectedElementIndicator />
		</>
	);
}
