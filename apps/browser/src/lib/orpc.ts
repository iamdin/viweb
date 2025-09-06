import { createORPCClient } from "@orpc/client";
import { RPCLink as FetchRPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import type { ChatRouter } from "@viweb/server-trpc/orpc";

const http: RouterClient<ChatRouter> = createORPCClient(
	new FetchRPCLink({
		url: "http://localhost:5173/viweb/rpc",
	}),
);

export const orpc = {
	http,
};
