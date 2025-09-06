import type { PluginObj } from "@babel/core";
import { createBabelPluginVisitor } from "./visitor";

interface InspectorBabelPluginOptions {
	rootPath?: string;
	relativePath?: string;
}

export function InspectorBabelPlugin(
	options: InspectorBabelPluginOptions,
): PluginObj {
	return {
		name: "@viweb/toolbar/inspector-babel-plugin",
		visitor: createBabelPluginVisitor({
			rootPath: options.rootPath,
			relativePath: options.relativePath,
		}),
	};
}
