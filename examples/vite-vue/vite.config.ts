import { URL, fileURLToPath } from "node:url";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
// import VibeDevtools from "@viweb/toolbar/vite";
import vibeDevCodeInspector from "@viweb/code-inspector/vite";
import { vueNodeTransformer } from "@viweb/code-inspector-core/transform";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	server: {
		port: 4001,
	},
	plugins: [
		vibeDevCodeInspector(),
		vue(),
		vueJsx(),
		// VibeDevtools(),
		// codeInspectorPlugin({
		// 	bundler: "vite",
		// 	printServer: true,
		// }),
		// Inspector({
		//   toggleButtonVisibility: "always",
		// }),
		// vueDevTools(),
		// inspector(),
	],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
});
