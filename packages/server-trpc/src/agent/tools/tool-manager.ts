import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import { createBashTool } from "./bash.js";
import { createStrReplaceEditor } from "./str-replace-editor.js";

export interface ToolExecutionContext {
	cwd: string;
	timeout?: number;
}

export class ToolManager {
	private context: ToolExecutionContext;

	constructor(context: ToolExecutionContext) {
		this.context = {
			timeout: 30000, // 30 seconds default timeout
			...context,
		};
	}

	createStrReplaceEditorTool() {
		return createStrReplaceEditor(async (params) => {
			const {
				command,
				path,
				file_text,
				insert_line,
				new_str,
				old_str,
				view_range,
			} = params;

			try {
				switch (command) {
					case "view": {
						try {
							const content = await fs.readFile(path, "utf-8");
							if (!view_range) return content;

							const lines = content.split("\n");
							const [start, end] = view_range;
							const startIdx = Math.max(0, start - 1);
							const endIdx =
								end === -1 ? lines.length : Math.min(lines.length, end);
							return lines.slice(startIdx, endIdx).join("\n");
						} catch (error) {
							throw new Error(
								`Failed to read file ${path}: ${error instanceof Error ? error.message : String(error)}`,
							);
						}
					}

					case "create": {
						if (!file_text) {
							throw new Error("file_text is required for create command");
						}
						try {
							// Check if file already exists
							try {
								await fs.access(path);
								throw new Error(
									`File ${path} already exists. Use str_replace to modify existing files.`,
								);
							} catch (accessError) {
								// File doesn't exist, which is what we want for create
							}

							// Ensure directory exists
							const dir = path.substring(0, path.lastIndexOf("/"));
							if (dir) {
								await fs.mkdir(dir, { recursive: true });
							}

							await fs.writeFile(path, file_text, "utf-8");
							return `File created successfully: ${path}`;
						} catch (error) {
							throw new Error(
								`Failed to create file ${path}: ${error instanceof Error ? error.message : String(error)}`,
							);
						}
					}

					case "str_replace": {
						if (typeof old_str !== "string") {
							throw new Error("old_str is required for str_replace command");
						}
						if (typeof new_str !== "string") {
							throw new Error("new_str is required for str_replace command");
						}
						try {
							const file_content = await fs.readFile(path, "utf-8");
							if (!file_content.includes(old_str)) {
								throw new Error(
									`String not found in file: ${old_str.slice(0, 100)}...`,
								);
							}
							const occurrences = file_content.split(old_str).length - 1;
							if (occurrences > 1) {
								throw new Error(
									`Multiple occurrences of string found (${occurrences}). Please make old_str more specific.`,
								);
							}
							const new_file_content = file_content.replace(old_str, new_str);
							await fs.writeFile(path, new_file_content, "utf-8");
							return `File updated successfully: ${path}`;
						} catch (error) {
							throw new Error(
								`Failed to replace string in file ${path}: ${error instanceof Error ? error.message : String(error)}`,
							);
						}
					}

					case "insert": {
						if (typeof new_str !== "string") {
							throw new Error("new_str is required for insert command");
						}
						if (typeof insert_line !== "number") {
							throw new Error("insert_line is required for insert command");
						}
						try {
							const file_content = await fs.readFile(path, "utf-8");
							const lines = file_content.split("\n");
							if (insert_line < 0 || insert_line > lines.length) {
								throw new Error(
									`Invalid insert_line: ${insert_line}. Must be between 0 and ${lines.length}`,
								);
							}
							lines.splice(insert_line, 0, new_str);
							const new_file_content = lines.join("\n");
							await fs.writeFile(path, new_file_content, "utf-8");
							return `Text inserted successfully at line ${insert_line} in ${path}`;
						} catch (error) {
							throw new Error(
								`Failed to insert text in file ${path}: ${error instanceof Error ? error.message : String(error)}`,
							);
						}
					}

					default: {
						throw new Error(
							`Invalid command: ${command}. Allowed commands are: view, create, str_replace, insert`,
						);
					}
				}
			} catch (error) {
				console.error("str_replace_editor error:", error);
				throw error;
			}
		});
	}

	createBashTool() {
		return createBashTool(async ({ command, restart }) => {
			try {
				if (restart) {
					return "Bash tool restarted successfully";
				}

				// Validate command safety
				const dangerousCommands = [
					"rm -rf /",
					"sudo rm",
					"format",
					"mkfs",
					"dd if=",
				];
				const isDangerous = dangerousCommands.some((dangerous) =>
					command.toLowerCase().includes(dangerous.toLowerCase()),
				);

				if (isDangerous) {
					throw new Error(`Potentially dangerous command blocked: ${command}`);
				}

				return new Promise((resolve, reject) => {
					const child = spawn("bash", ["-c", command], {
						cwd: this.context.cwd,
						stdio: ["pipe", "pipe", "pipe"],
					});

					let stdout = "";
					let stderr = "";

					// Set timeout to prevent hanging
					const timeout = setTimeout(() => {
						child.kill("SIGTERM");
						reject(
							new Error(
								`Command timed out after ${this.context.timeout}ms: ${command}`,
							),
						);
					}, this.context.timeout);

					child.stdout?.on("data", (data) => {
						stdout += data.toString();
					});

					child.stderr?.on("data", (data) => {
						stderr += data.toString();
					});

					child.on("close", (code) => {
						clearTimeout(timeout);
						if (code === 0) {
							console.log(`Bash command executed successfully: ${command}`);
							console.log(
								`Output: ${stdout.slice(0, 200)}${stdout.length > 200 ? "..." : ""}`,
							);
							resolve(stdout || "Command executed successfully");
						} else {
							const errorMsg = `Command failed with exit code ${code}: ${command}\nStderr: ${stderr}\nStdout: ${stdout}`;
							console.error(errorMsg);
							reject(new Error(errorMsg));
						}
					});

					child.on("error", (error) => {
						clearTimeout(timeout);
						reject(new Error(`Failed to execute command: ${error.message}`));
					});
				});
			} catch (error) {
				console.error("bash tool error:", error);
				throw new Error(
					`Bash execution failed: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		});
	}

	getTools() {
		return {
			str_replace_editor: this.createStrReplaceEditorTool(),
			bash: this.createBashTool(),
			// Alternative implementation using external tools:
			// str_replace_editor: externalTools.textEditor({
			// 	execute: async (params) => {
			// 		// @ts-ignore
			// 		return this.createStrReplaceEditorTool()(params);
			// 	},
			// }),
			// bash: externalTools.bash({
			// 	execute: async (params) => {
			// 		// @ts-ignore
			// 		return this.createBashTool()(params);
			// 	},
			// }),
		};
	}
}
