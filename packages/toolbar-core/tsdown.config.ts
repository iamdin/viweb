import { defineConfig } from "tsdown";

export default defineConfig(async () => {
	return {
		entry: ["src/*.ts", "src/inspector/*.ts"],
		format: ["esm"],
		target: "es2022",
		platform: "browser",
		publint: true,
		exports: {
			all: true,
			devExports: false,
		},
		noExternal: ["pathe"],
		unbundle: true,
	};
});
