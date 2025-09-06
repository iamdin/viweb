import { vscodeServerPort } from "@/constants";
import {
	createTRPCClient,
	httpLink,
	httpSubscriptionLink,
	splitLink,
} from "@trpc/client";
import type { AppRouter as VscodeAppRouter } from "@viweb/vscode-trpc/routes/_app";
import superjson from "superjson";

const vscodeUrl = Number.isInteger(Number(vscodeServerPort))
	? `http://localhost:${vscodeServerPort}/trpc`
	: "";
export const vscodeTrpc = createTRPCClient<VscodeAppRouter>({
	links: [
		splitLink({
			condition: (opts) => opts.type === "subscription",
			true: httpSubscriptionLink({ url: vscodeUrl, transformer: superjson }),
			false: httpLink({ url: vscodeUrl, transformer: superjson }),
		}),
	],
});
