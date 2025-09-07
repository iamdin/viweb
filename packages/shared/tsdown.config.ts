import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["src/**/*.ts"],
	format: ["esm"],
	exports: {
		all: true,
		devExports: true,
	},
});
