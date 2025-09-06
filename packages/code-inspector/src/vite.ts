import { vibeDevCodeInspector } from "./index";

/**
 * Vite plugin
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import VibeDevtools from 'unplugin-inspector/vite'
 *
 * export default defineConfig({
 *   plugins: [VibeDevtools()],
 * })
 * ```
 */
const vite = vibeDevCodeInspector.vite as typeof vibeDevCodeInspector.vite;
export default vite;
