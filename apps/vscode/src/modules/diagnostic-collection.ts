import * as vscode from "vscode";

export const DIAGNOSTIC_COLLECTION_NAME = "vibe-coding-devtools";
export const fakeDiagnosticCollection =
	vscode.languages.createDiagnosticCollection(DIAGNOSTIC_COLLECTION_NAME);
