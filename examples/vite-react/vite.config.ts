import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import vibeDevToolbar from "@viweb/toolbar/vite";
// import { InspectorBabelPlugin } from "@viweb/toolbar-core/inspector/babel";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	server: {
		port: 5173,
	},
	plugins: [
    tanstackRouter({
      target: "react",
			autoCodeSplitting: true,
		}),
    vibeDevToolbar(),
		// codeInspector(),
		react(),
		tailwindcss(),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),

			// fix loading all icon chunks in dev mode
			// https://github.com/tabler/tabler-icons/issues/1233
			"@tabler/icons-react": "@tabler/icons-react/dist/esm/icons/index.mjs",
		},
	},
});
