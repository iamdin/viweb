import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import "dotenv/config";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "wxt";

export default defineConfig({
	manifest: {
		name: "Viweb",
		description: "Viweb",
		permissions: [
			"cookies",
			"storage",
			"activeTab",
			"debugger",
			"tabs",
			"devtools",
			"webRequest",
			"sidePanel",
		],
		host_permissions: ["*://*/*"],
		devtools_page: "devtools.html",
		web_accessible_resources: [
			{
				resources: ["content-main-world.js"],
				matches: ["*://*/*"],
			},
		],
	},
	imports: false,
	srcDir: "src",
	entrypointsDir: "app",
	publicDir: "public",
	outDir: "dist",
	vite: () => ({
		plugins: [react(), tsconfigPaths(), tailwindcss()],
	}),
	hooks: {},
	webExt: {
		startUrls: ["http://localhost:5173"],
	},
});
