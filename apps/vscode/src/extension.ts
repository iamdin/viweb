// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { fakeDiagnosticCollection } from "./modules/diagnostic-collection";
import { statusBar, updateStatusBar } from "./modules/status-bar";
import { createServer, stopServer } from "./server";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log("Activating vibe-coding-devtools-vscode");
	statusBar.show();

	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (workspaceFolders?.length !== 1) {
		vscode.window.showErrorMessage(
			"Please open a single workspace folder to use vibe-coding-devtools-vscode",
		);
		return;
	}

	console.log(
		'Congratulations, your extension "vibe-coding-vscode" is now active!',
	);

	const workspaceFolder = workspaceFolders[0];
	const workspaceFoldersPaths = workspaceFolders.map(
		(folder) => folder.uri.fsPath,
	);

	console.log("workspace", workspaceFoldersPaths);

	try {
		createServer({
			workspaceFoldersPaths,
			onServerStarting: () => {
				updateStatusBar({ status: "starting", port: 4000 });
			},
			onServerRunning: (port) => {
				updateStatusBar({ status: "running", port });
			},
			onServerStopped: () => {
				updateStatusBar({ status: "stopped" });
			},
			onServerError: (error) => {
				updateStatusBar({ status: "error", error, port: 4000 });
			},
		});
	} catch (error) {
		console.error(error);
		updateStatusBar({ status: "error", error: error as Error, port: 4000 });
	}

	// Dispose on deactivation
	context.subscriptions.push(fakeDiagnosticCollection);
	context.subscriptions.push(statusBar);
}

// This method is called when your extension is deactivated
export async function deactivate() {
	await stopServer();
	fakeDiagnosticCollection.dispose();
	statusBar.dispose();
}
