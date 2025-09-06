import invariant from "tiny-invariant";
import { assign, setup } from "xstate";
import type { InspectDataset, InspectMetadata } from "./types";
import { tryInspectElement } from "./util";

interface InspectContext {
	currentElement?: HTMLElement;
	currentElementRect?: DOMRect;
	currentElementMetadata?: InspectMetadata;
	inspectedElement?: HTMLElement;
	inspectedElementRect?: DOMRect;
	inspectedElementMetadata?: InspectMetadata;
	inspectedElementDataset?: InspectDataset;
}

type InspectEvents =
	| { type: "START" }
	| { type: "STOP" }
	| { type: "POINTER_MOVE"; event: PointerEvent }
	| { type: "POINTER_DOWN"; event: PointerEvent }
	| { type: "POINTER_LEAVE" }
	| { type: "DELETE_INSPECTED" }
	| { type: "UPDATE_INSPECTED_RECT" };

export const inspectorMachine = setup({
	types: {
		context: {} as InspectContext,
		events: {} as InspectEvents,
	},
	actions: {
		handlePointerMove: assign(({ event, context }) => {
			invariant(event.type === "POINTER_MOVE", "Invalid event type");

			const current = tryInspectElement(event.event, context.inspectedElement);
			if (!current) return {};

			current.element.style.cursor = "pointer";

			return {
				currentElement: current.element,
				currentElementRect: current.element.getBoundingClientRect(),
				currentElementMetadata: current.metadata,
			};
		}),
		handlePointerDown: assign(({ event, context }) => {
			invariant(event.type === "POINTER_DOWN", "Invalid event type");

			event.event.preventDefault();
			event.event.stopPropagation();
			event.event.stopImmediatePropagation();

			const inspected = tryInspectElement(
				event.event,
				context.inspectedElement,
			);
			if (!inspected) return {};

			return {
				inspectedElement: inspected.element,
				inspectedElementRect: inspected.element.getBoundingClientRect(),
				inspectedElementMetadata: inspected.metadata,
				inspectedElementDataset: {
					id: inspected.element.dataset?.id,
				},
			};
		}),
		updateInspectedRect: assign({
			inspectedElementRect: ({ context }) => {
				if (!context.inspectedElement) return;
				return context.inspectedElement.getBoundingClientRect();
			},
		}),
		clearCurrentElement: assign({
			currentElement: undefined,
			currentElementRect: undefined,
			currentElementMetadata: undefined,
		}),
		clearInspectedElement: assign({
			inspectedElement: undefined,
			inspectedElementRect: undefined,
			inspectedElementMetadata: undefined,
			inspectedElementDataset: undefined,
		}),
	},
}).createMachine({
	id: "inspect",
	initial: "idle",
	states: {
		idle: {
			on: {
				START: "inspecting",
			},
		},
		inspecting: {
			on: {
				POINTER_MOVE: { actions: "handlePointerMove" },
				POINTER_DOWN: {
					target: "inspected",
					actions: "handlePointerDown",
				},
				POINTER_LEAVE: {
					actions: "clearCurrentElement",
				},
				DELETE_INSPECTED: {
					actions: "clearInspectedElement",
				},
				UPDATE_INSPECTED_RECT: {
					actions: "updateInspectedRect",
				},
				STOP: {
					target: "idle",
					actions: "clearInspectedElement",
				},
			},
		},
		inspected: {
			on: {
				POINTER_MOVE: "inspecting",
				DELETE_INSPECTED: {
					target: "inspecting",
					actions: "clearInspectedElement",
				},
				UPDATE_INSPECTED_RECT: {
					actions: "updateInspectedRect",
				},
				STOP: {
					target: "idle",
					actions: ["clearInspectedElement", "clearCurrentElement"],
				},
			},
		},
	},
});
