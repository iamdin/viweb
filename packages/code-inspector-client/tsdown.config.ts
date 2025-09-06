import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { type UserConfig, defineConfig } from "tsdown";

export default defineConfig(async () => {
	const vibeDevClientCodeRaw = await readVibeDevClientCodeRaw();

	return {
		entry: ["src/index.ts"],
		format: ["esm"],
		target: "esnext",
		platform: "browser",
		publint: true,
		exports: false,
		clean: false,
		tsconfig: "./tsconfig.app.json",
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
		external: ["react", "react-dom"],
		unbundle: true,
		define: {
			__VIBE_DEV_CODE_INSPECTOR_CLIENT_CODE_RAW__:
				JSON.stringify(vibeDevClientCodeRaw),
		},
	} satisfies UserConfig;
});

/**
 * Read the vibe dev client code raw from the client.js file
 * @returns The vibe dev client code raw string
 */
async function readVibeDevClientCodeRaw() {
	const vibeDevClientCodeRaw = await fs.readFile(
		fileURLToPath(new URL("dist/client.js", import.meta.url)),
		"utf-8",
	);

	if (!vibeDevClientCodeRaw) {
		throw new Error("Vibe Dev Client Code Raw is not found");
	}

	return vibeDevClientCodeRaw;
}
