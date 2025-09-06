import fs from "node:fs/promises";
import { resolvePath } from "mlly";
import invariant from "tiny-invariant";
import { createVitePlugin } from "unplugin";
import type { ViteDevServer } from "vite";
import { transformHandler } from "./core/utils";
import { handler } from "./server/handler";

const CLIENT_PUBLIC_PATH = "/@viweb/toolbar-client";

const vite = createVitePlugin(() => {
	let _server: ViteDevServer;
	return {
		name: "unplugin-viweb",
		enforce: "pre",
		vite: {
			configureServer(server) {
				_server = server;
				server.middlewares.use("/viweb/rpc", async (req, res, next) => {
					const { matched } = await handler.handle(req, res, {
						prefix: "/viweb/rpc",
						context: {},
					});
					if (matched) {
						return;
					}
					next();
				});
			},
			transformIndexHtml(html) {
				return {
					html,
					tags: [
						{
							tag: "script",
							injectTo: "head-prepend",
							attrs: { type: "module", src: CLIENT_PUBLIC_PATH },
						},
					],
				};
			},
			async load(id) {
				if (id === CLIENT_PUBLIC_PATH) {
					const path = await resolvePath("@viweb/toolbar-client", {
						url: import.meta.url,
					});
					const content = await fs.readFile(path, "utf-8");
					invariant(
						_server.resolvedUrls?.local?.[0],
						"dev server local url is not found",
					);
					return replaceDefine(content, {
						"process.env.VIWEB_LOCAL_URL": JSON.stringify(
							_server.resolvedUrls.local[0],
						),
						"process.env.VIWEB_WORKSPACE_PATH": JSON.stringify(process.cwd()),
						"process.env.VIWEB_ROOT_PATH": JSON.stringify(process.cwd()),
					});
				}
			},
			transform: {
				filter: {
					id: { exclude: [/node_modules/], include: /\.(jsx|tsx|vue)$/ },
				},
				handler(code, id) {
					return transformHandler(id, code, {
						rootPath: process.cwd(),
						absolutePath: id.split("?", 2)[0],
					});
				},
			},
		},
	};
});

function replaceDefine(code: string, define: { [key: string]: string }) {
	return Object.keys(define).reduce((acc, key) => {
		return acc.replace(key, define[key as keyof typeof define]);
	}, code);
}

export default vite;
