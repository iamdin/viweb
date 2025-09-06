import { vibeDevCodeInspector } from "./index";

/**
 * Webpack plugin
 *
 * @example
 * ```js
 * // webpack.config.js
 * import VibeDevtools from 'unplugin-inspector/webpack'
 *
 * default export {
 *  plugins: [VibeDevtools()],
 * }
 * ```
 */
const webpack =
	vibeDevCodeInspector.webpack as typeof vibeDevCodeInspector.webpack;
export default webpack;
