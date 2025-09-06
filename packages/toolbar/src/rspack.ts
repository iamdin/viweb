import { vibeDevToolbar } from "./index";

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
const rspack = vibeDevToolbar.rspack as typeof vibeDevToolbar.rspack;
export default rspack;
