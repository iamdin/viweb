import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import type { Context } from "./context.ts";

const trpc = initTRPC.context<Context>().create({
	transformer: superjson,
	errorFormatter({ shape }) {
		return shape;
	},
	sse: {
		enabled: true,
		maxDurationMs: 30_000,
		client: {
			reconnectAfterInactivityMs: 3_000,
		},
		ping: {
			enabled: true,
			intervalMs: 2_000,
		},
	},
});

export const createCallerFactory = trpc.createCallerFactory;

export const publicProcedure = trpc.procedure;

export const router = trpc.router;

export const mergeRouters = trpc.mergeRouters;
