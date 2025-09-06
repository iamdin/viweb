import type { Server } from "node:http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "@viweb/vscode-trpc/routes/_app";
import cors from "cors";
import express from "express";
import { composerFixErrorMessage } from "../lib/cursor";

// type DiagnosticEntry = [vscode.Uri, readonly vscode.Diagnostic[]];
let server: Server;

export function createServer(options: {
	workspaceFoldersPaths: string[];
	onServerStarting?: () => void;
	onServerRunning?: (port: number) => void;
	onServerStopped?: () => void;
	onServerError?: (error: Error) => void;
}) {
	options.onServerStarting?.();

	const app = express();

	app.use(cors());
	app.use(
		"/trpc",
		createExpressMiddleware({
			router: appRouter,
			createContext: () => ({
				workspaceFoldersPaths: options.workspaceFoldersPaths,
				composerFixErrorMessage,
			}),
		}),
	);

	const port = 4000;

	// http server
	server = app.listen(port, () => {
		console.log(`✅ Server listening on http://localhost:${port}`);
		options.onServerRunning?.(port);
	});

	// 监听服务器错误
	server.on("error", (error: Error) => {
		console.error("❌ Server error:", error);
		options.onServerError?.(error);
	});
}

export function stopServer() {
	return new Promise<void>((resolve, reject) => {
		if (!server) {
			return resolve();
		}
		server.close((err) => {
			if (err) reject(err);
			else resolve();
		});
	});
}
