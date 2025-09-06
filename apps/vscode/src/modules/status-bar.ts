import * as vscode from "vscode";

export const statusBar = vscode.window.createStatusBarItem(
	vscode.StatusBarAlignment.Left,
	0,
);

export type Status = "starting" | "running" | "stopped" | "error";

export type UpdateStatusBarParams =
	| {
			status: "starting";
			port: number;
	  }
	| {
			status: "running";
			port: number;
	  }
	| {
			status: "stopped";
	  }
	| {
			status: "error";
			error: Error;
			port: number;
	  };

export const updateStatusBar = (params: UpdateStatusBarParams) => {
	switch (params.status) {
		case "starting":
			statusBar.text = "$(loading~spin) Starting...";
			statusBar.backgroundColor = new vscode.ThemeColor(
				"statusBar.warningBackground",
			);
			statusBar.tooltip = `Vibe Coding DevTools Server is starting (port: ${params.port})`;
			break;
		case "running":
			statusBar.text = `$(server-process) Port: ${params.port}`;
			statusBar.backgroundColor = new vscode.ThemeColor(
				"statusBar.prominentBackground",
			);
			statusBar.tooltip = `Vibe Coding DevTools Server is running (port: ${params.port})`;
			break;
		case "stopped":
			statusBar.text = "$(debug-stop) Vibe DevTools Server is stopped";
			statusBar.backgroundColor = new vscode.ThemeColor(
				"statusBar.errorBackground",
			);
			statusBar.tooltip = "Vibe Coding DevTools Server is stopped";
			break;
		case "error":
			statusBar.text = "$(error) Vibe DevTools Error";
			statusBar.backgroundColor = new vscode.ThemeColor(
				"statusBar.errorBackground",
			);
			statusBar.tooltip = `Vibe Coding DevTools Server is error (port: ${params.port}), ${params.error.message}`;
			break;
	}
};
