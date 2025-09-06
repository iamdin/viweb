import child_process from "node:child_process";
import * as vscode from "vscode";
import { fakeDiagnosticCollection } from "../modules/diagnostic-collection";
import { sleep } from "./utils";

export function openWindowAndDocument(filePath: string) {
	return new Promise<void>((resolve, reject) => {
		const childProcess = child_process.spawn("cursor", [filePath], {
			stdio: "inherit",
			env: process.env,
		});

		childProcess.on("exit", (code) => {
			if (code === 0) {
				resolve();
			} else {
				reject();
			}
		});

		childProcess.on("error", (error) => {
			reject(error);
		});
	});
}

export async function composerFixErrorMessage({
	prompt,
	files,
}: {
	prompt: string;
	files: { path: string; line: number; column: number }[];
}) {
	console.log("composerFixErrorMessage", { prompt, files });
	try {
		/** fake diagnostic start */
		// const diagnosticEntries: DiagnosticEntry[] = [];
		// for (const filePath of files) {
		//   const uri = vscode.Uri.file(filePath);
		//   const document = await vscode.workspace.openTextDocument(uri);
		//   const editor = await vscode.window.showTextDocument(document);
		//   const diagnostic = new vscode.Diagnostic(
		//     editor?.selection ??
		//       new vscode.Range(0, 0, document?.lineCount ?? 0, 0),
		//     prompt,
		//     vscode.DiagnosticSeverity.Error
		//   );
		//   diagnosticEntries.push([document.uri, [diagnostic]]);
		// }
		// fakeDiagnosticCollection.set(diagnosticEntries);
		// await openWindowAndDocument(files[0].path);
		const url = vscode.Uri.file(files[0].path);
		const document = await vscode.workspace.openTextDocument(url);
		const editor = await vscode.window.showTextDocument(document);

		editor.selection = new vscode.Selection(
			files[0].line - 1,
			files[0].column - 1,
			files[0].line - 1,
			files[0].column - 1,
		);
		const fakeDiagnostic = new vscode.Diagnostic(
			editor.selection,
			prompt,
			vscode.DiagnosticSeverity.Warning,
		);
		fakeDiagnosticCollection.set([[editor.document.uri, [fakeDiagnostic]]]);
		/** fake diagnostic end */

		// sleep 200ms to ensure editor is ready
		await sleep(200);

		await vscode.commands.executeCommand("composer.fixerrormessage");
		// await vscode.commands.executeCommand("composer.startComposerPrompt2", "chat");
		// this command can toggle inline editor
		// await vscode.commands.executeCommand(
		//   "aipopup.action.modal.generate"
		// );
		vscode.window.showInformationMessage("call composer success");
	} catch (error) {
		vscode.window.showErrorMessage(
			`composer fix error message failed: ${error}`,
		);
	} finally {
		fakeDiagnosticCollection.clear();
	}
}
