import { transform } from "@viweb/toolbar-core/inspector/transform";
import { type UnpluginInstance, createUnplugin } from "unplugin";
import { parseVueRequest } from "./core/utils";

export const CLIENT_PUBLIC_PATH = "@viweb/toolbar-client" as const;
export const name = "unplugin-vibe-dev-toolbar" as const;

export const vibeDevToolbar: UnpluginInstance<void, false> = createUnplugin(
	() => {
		return {
			name,
			enforce: "pre",
			transform: {
				filter: { id: { exclude: [/node_modules/], include: /\.(jsx|tsx)$/ } },
				handler(code, id) {
					const { filename, query } = parseVueRequest(id);
					const isJsx =
						filename.endsWith(".jsx") ||
						filename.endsWith(".tsx") ||
						(filename.endsWith(".vue") && query.isJsx);
					const isTpl =
						filename.endsWith(".vue") && query.type !== "style" && !query.raw;

					if (isJsx || isTpl) {
						const result = transform(code, {
							rootPath: process.cwd(),
							absolutePath: filename,
						});
						if (result?.code) {
							return {
								code: result.code,
								map: result.map,
							};
						}
					}
					// return compileSFCTemplate({
					// 	code,
					// 	id: filename,
					// 	type: isJsx ? "jsx" : "template",
					// });
					return null;
				},
			},

			vite: {
				apply(_, { command }) {
					return command === "serve";
				},
				// add client script to index.html
				transformIndexHtml(html) {
					// const code = getVibeDevClientCode({
					// 	workspacePath: process.cwd(),
					// 	rootPath: process.cwd(),
					// 	serverPort: 4003,
					// });
					const code = "";

					return {
						html,
						tags: [
							{
								tag: "script",
								injectTo: "head",
								attrs: { type: "module" },
								children: code,
							},
						],
					};
				},
				configureServer(server) {
					console.log(server);
				},
				// load: {
				// 	filter: { id: new RegExp(CLIENT_PUBLIC_PATH) },
				// 	async handler() {
				// 		try {
				// 			return defineReplace(vibeDevClientCodeRaw);
				// 		} catch (error) {
				// 			console.error(error);
				// 			return null;
				// 		}
				// 	},
				// },
			},
			rspack(compiler) {
				compiler.hooks.emit.tapAsync(
					"vibe-dev",
					async (compilation, callback) => {
						const assets = compilation.getAssets();
						const html = assets.find((asset) => /\.html$/.test(asset.name));
						if (!html) return;
						const content = html?.source.source().toString();
						if (!content) return;
						// const injectCode = getVibeDevClientCode({
						// 	workspacePath: process.cwd(),
						// 	rootPath: process.cwd(),
						// 	serverPort: 4003,
						// });
						const injectCode = "";
						console.log("process.env.NODE_ENV", process.env.NODE_ENV);
						const source = new compiler.rspack.sources.RawSource(
							content?.replace(
								"<head>",
								`<head><script type="module" src="/${CLIENT_PUBLIC_PATH}"></script>`,
							),
						);
						compilation.updateAsset(html.name, source);
						compilation.emitAsset(
							CLIENT_PUBLIC_PATH,
							new compiler.rspack.sources.RawSource(injectCode ?? ""),
							{ minimized: true },
						);

						callback();
					},
				);
			},
		};
	},
);

export function defineReplace(code: string): string {
	const defines = {
		__WORKSPACE_PATH__: process.cwd(),
		__ROOT_PATH__: process.cwd(),
	};
	return Object.keys(defines).reduce((acc, key) => {
		return acc.replace(
			new RegExp(key, "g"),
			JSON.stringify(defines[key as keyof typeof defines]),
		);
	}, code);
}
