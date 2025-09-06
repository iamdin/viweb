import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["src/*.ts"],
	format: ["esm", "cjs"],
	target: "es2022",
	platform: "node",
	publint: true,
	exports: {
		all: true,
		devExports: false,
	},
	treeshake: true,
	noExternal: ["pathe"],
});
