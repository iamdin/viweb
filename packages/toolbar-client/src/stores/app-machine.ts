import type { RefObject } from "react";
import invariant from "tiny-invariant";
import { assign, setup } from "xstate";

type AppContext = {
	container: HTMLDivElement;
	toolbarRef: RefObject<HTMLDivElement> | null;
	apps: { id: string; active: boolean }[];
};
type AppEvents = { type: "TOGGLE"; id: string };
type AppInput = {
	container: HTMLDivElement;
	apps: { id: string }[];
	toolbarRef: RefObject<HTMLDivElement>;
};

export const appMachine = setup({
	types: {
		events: {} as AppEvents,
		context: {} as AppContext,
		input: {} as AppInput,
	},
	actions: {
		toggleApp: assign({
			apps: ({ context, event }) => {
				invariant(event.type === "TOGGLE", "Invalid event");

				const apps = context.apps;
				const app = apps.find((app) => app.id === event.id);

				invariant(app, `App with id ${event.id} not found`);

				app.active = !app.active;
				return apps;
			},
		}),
	},
}).createMachine({
	initial: "idle",
	context: ({ input }) => ({
		container: input.container,
		toolbarRef: input.toolbarRef,
		apps: input.apps.map((app) => ({
			id: app.id,
			active: false,
		})),
	}),
	states: {
		idle: {
			on: {
				TOGGLE: {
					target: "toggled",
					actions: "toggleApp",
				},
			},
		},
		toggled: {
			on: {
				TOGGLE: {
					target: "idle",
					actions: "toggleApp",
				},
			},
		},
	},
});
