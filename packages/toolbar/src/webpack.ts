import { vibeDevToolbar } from "./index";

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
const webpack = vibeDevToolbar.webpack as typeof vibeDevToolbar.webpack;
export default webpack;
