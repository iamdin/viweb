import { vibeDevCodeInspector } from "./index";

/**
 * Rspack plugin
 *
 * @example
 * ```js
 * // rspack.config.js
 * import VibeDevtools from 'unplugin-inspector/rspack'
 *
 * default export {
 *  plugins: [VibeDevtools()],
 * }
 * ```
 */
const rspack =
	vibeDevCodeInspector.rspack as typeof vibeDevCodeInspector.rspack;
export default rspack;
