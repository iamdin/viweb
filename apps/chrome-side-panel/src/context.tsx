import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import type { ChatRouter } from "@viweb/server-trpc/orpc";
import { createContext, useContext, useMemo } from "react";

interface ORPCContextType {
	orpc?: {
		http: RouterClient<ChatRouter>;
	};
}

const ORPCContext = createContext<ORPCContextType>({} as ORPCContextType);

export function ORPCContextProvider({
	url,
	children,
}: { url?: string; children: React.ReactNode }) {
	const orpc = useMemo(() => {
		if (!url) return undefined;
		return {
			http: createORPCClient(
				new RPCLink({
					url: new URL("/viweb/rpc", url).toString(),
				}),
			) as RouterClient<ChatRouter>,
		};
	}, [url]);

	return (
		<ORPCContext.Provider value={{ orpc }}>{children}</ORPCContext.Provider>
	);
}

export function useORPC() {
	return useContext(ORPCContext);
}
