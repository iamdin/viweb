import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-oxc";
import { defineConfig } from "vite";
import pkg from "./package.json";

export default defineConfig(({ mode }) => ({
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
			...resolveESM([
				"@floating-ui/react",
				"@xstate/react",
				"class-variance-authority",
				"clsx",
				"lucide-react",
				"pathe",
				"react",
				"react-dom",
				"tailwind-merge",
				"tiny-invariant",
				"xstate",
			]),
		},
	},
	define: {
		"process.env.NODE_ENV": JSON.stringify(mode),
	},
	build: {
		minify: mode !== "development" ? "oxc" : false,
		target: "es2022",
		lib: {
			entry: "src/client.tsx",
			fileName: "client",
			formats: ["es"],
		},
		outDir: "dist",
	},
	plugins: [react(), tailwindcss()],
	experimental: {
		enableNativePlugin: true,
	},
}));

function resolveESM(deps: (keyof typeof pkg.devDependencies)[]) {
	return deps.reduce(
		(acc, key) => {
			acc[key] = `https://esm.sh/${key}@${pkg.devDependencies[key]}`;
			return acc;
		},
		{} as Record<string, string>,
	);
}
