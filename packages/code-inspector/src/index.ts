import { fileURLToPath } from "node:url";
import { vibeDevCodeInspectorClientCodeRaw } from "@viweb/code-inspector-client";
import { transform } from "@viweb/code-inspector-core";
import { transformTemplate } from "@viweb/code-inspector-core/transform";
import { type UnpluginInstance, createUnplugin } from "unplugin";
import { parseVueRequest } from "./core/utils";

// const CLIENT_PUBLIC_PATH = "@viweb/code-inspector-client" as const;
const name = "unplugin-vibe-dev-code-inspector" as const;

export const vibeDevCodeInspector: UnpluginInstance<void, false> =
	createUnplugin(() => {
		const enforce = "pre";
		return {
			name,
			enforce,
			vite: {
				apply(_, { command }) {
					return command === "serve";
				},
				transform: {
					filter: {
						id: { exclude: [/node_modules/], include: /\.(jsx|tsx|vue)$/ },
					},
					handler(code, id) {
						const { filename, query } = parseVueRequest(id);
						const isJsx =
							filename.endsWith(".jsx") ||
							filename.endsWith(".tsx") ||
							(filename.endsWith(".vue") && query.isJsx);
						const isTemplate =
							filename.endsWith(".vue") && query.type !== "style" && !query.raw;
						if (isJsx) {
							const result = transform(code, {
								rootPath: process.cwd(),
								absolutePath: filename,
							});
							// biome-ignore lint/style/noNonNullAssertion: <explanation>
							return { code: result.code!, map: result.map };
						}
						if (isTemplate) {
							const result = transformTemplate(code, {
								rootPath: process.cwd(),
								absolutePath: filename,
							});
							return { code: result.code, map: result.map };
						}
						return null;
					},
				},
				// add client script to index.html
				transformIndexHtml(html) {
					return {
						html,
						tags: [
							{
								tag: "script",
								injectTo: "head",
								attrs: { type: "module" },
								children: vibeDevCodeInspectorClientCodeRaw,
							},
						],
					};
				},
			},
			rspack(compiler) {
				if (
					typeof compiler?.options?.experiments?.cache === "object" &&
					compiler?.options?.experiments?.cache?.type === "persistent"
				) {
					compiler.options.experiments.cache.version = `${name}-${Date.now()}`;
				}
				const rules = compiler.options.module.rules;
				rules.unshift(
					{
						test: /\.html$/,
						resourceQuery: /vue/,
						use: [
							{
								loader: fileURLToPath(new URL("./loader.js", import.meta.url)),
							},
						],
						enforce,
					},
					{
						test: /\.(vue|jsx|tsx)$/,
						use: [
							{
								loader: fileURLToPath(new URL("./loader.js", import.meta.url)),
							},
						],
						enforce,
					},
				);

				compiler.hooks.emit.tapAsync(name, async (compilation, callback) => {
					const assets = compilation.getAssets();
					const html = assets.find((asset) => /\.html$/.test(asset.name));
					if (!html) return;
					const content = html?.source.source().toString();
					if (!content) return;
					const source = new compiler.rspack.sources.RawSource(
						content?.replace(
							"<head>",
							`<head><script type="module">\n${vibeDevCodeInspectorClientCodeRaw}\n</script>`,
						),
					);
					compilation.updateAsset(html.name, source);
					// compilation.emitAsset(
					// 	CLIENT_PUBLIC_PATH,
					// 	new compiler.rspack.sources.RawSource(
					// 		vibeDevCodeInspectorClientCodeRaw ?? "",
					// 	),
					// 	{ minimized: true },
					// );
					callback();
				});
			},
		};
	});
