declare const __VIBE_DEV_CLIENT_CODE_RAW__: string;

const vibeDevClientCodeRaw = __VIBE_DEV_CLIENT_CODE_RAW__;

interface InjectCodeOptions {
	/**
	 * The root path, equals of process.cwd()
	 */
	rootPath: string;
	/**
	 * The workspace path, useful in monorepo
	 */
	workspacePath?: string;
	/**
	 * The server port, equals of vibe-dev-server port
	 */
	serverPort?: number;
	/**
	 * The vscode server port, equals of vibe-dev-vscode port
	 */
	vscodeServerPort?: number;
}

export function getVibeDevClientCode(options: InjectCodeOptions) {
	const DEFINES = {
		CLIENT_VARIABLE_VSCODE_SERVER_PORT: options.vscodeServerPort,
		CLIENT_VARIABLE_SERVER_PORT: options.serverPort,
		CLIENT_VARIABLE_WORKSPACE_PATH: options.workspacePath,
		CLIENT_VARIABLE_ROOT_PATH: options.rootPath,
		CLIENT_VARIABLE_TOOLBAR_ENABLED: "true",
	};
	return Object.keys(DEFINES).reduce((acc, key) => {
		return acc?.replace(
			new RegExp(key, "g"),
			JSON.stringify(DEFINES[key as keyof typeof DEFINES]),
		);
	}, vibeDevClientCodeRaw);
}
