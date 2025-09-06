import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import pkg from "./package.json";

export default defineConfig(({ mode }) => ({
	plugins: [react({ disableOxcRecommendation: true }), tailwindcss()],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
			...resolveESM([
				// "@ark-ui/react",
				// "@babel/types",
				// "@babel/core",
				// "@babel/standalone",
				"@floating-ui/react",
				"@trpc/client",
				"@xstate/react",
				"class-variance-authority",
				"clsx",
				"lucide-react",
				"pathe",
				"react",
				"react-dom",
				"superjson",
				"tailwind-merge",
				"tiny-invariant",
				"xstate",
				"zod",
				"@orpc/client",
				"@orpc/server",
			]),
		},
	},
	define: {
		"process.env.NODE_ENV": JSON.stringify(mode),
	},
	build: {
		minify: mode !== "development" ? "oxc" : false,
		target: "esnext",
		lib: {
			entry: "src/main.tsx",
			fileName: "index",
			formats: ["es"],
		},
	},
	experimental: {
		enableNativePlugin: true,
	},
}));

function resolveESM(deps: (keyof typeof pkg.dependencies)[]) {
	return deps.reduce(
		(acc, key) => {
			acc[key] = `https://esm.sh/${key}@${pkg.dependencies[key]}`;
			return acc;
		},
		{} as Record<string, string>,
	);
}
