import { workspacePath } from "@/constants";
import { vscodeTrpc } from "@/lib/trpc";
import { useCallback, useEffect, useState } from "react";

export function useConnect() {
	const [connecting, setConnecting] = useState(false);
	const [connected, setConnected] = useState<boolean | null>(null);
	const [error, setError] = useState<Error | null>(null);

	const checkConnection = useCallback(async () => {
		setConnecting(true);
		setError(null);
		try {
			const [isConnected] = await Promise.allSettled([
				vscodeTrpc.connection.health.query(workspacePath),
				// serverTrpc.connection.query({
				// 	root: workspacePath,
				// }),
				new Promise((resolve) => setTimeout(resolve, 1000)),
			]);
			if (
				isConnected.status === "fulfilled" &&
				isConnected.value
				// isServerConnected.status === "fulfilled"
			) {
				setConnected(isConnected.value);
			}
		} catch (err) {
			setConnected(false);
			setError(new Error("Connection failed"));
		} finally {
			setConnecting(false);
		}
	}, []);

	useEffect(() => {
		checkConnection();
	}, [checkConnection]);

	return {
		connecting,
		connected,
		error,
		reconnect: checkConnection,
	};
}
