import path from "node:path";
import type { LoaderContext } from "@rspack/core";
import {
	transform,
	transformTemplate,
} from "@viweb/code-inspector-core/transform";
import { parseVueRequest } from "./core/utils";

export default async function VibeDevCodeInspectorLoader(
	this: LoaderContext,
	source: string,
) {
	const absolutePath = this.resourcePath;
	const relativePath = path.relative(process.cwd(), absolutePath);

	const { filename, query } = parseVueRequest(this.resourcePath);
	const isJsx =
		filename.endsWith(".jsx") ||
		filename.endsWith(".tsx") ||
		(filename.endsWith(".vue") && query.isJsx);
	const isTemplate =
		filename.endsWith(".vue") && query.type !== "style" && !query.raw;

	if (isJsx) {
		const result = transform(source, { relativePath });
		return this.callback(null, result.code || "", result.map || undefined);
	}

	if (isTemplate) {
		const result = transformTemplate(source, { relativePath });
		return this.callback(null, result.code || "", result.map || undefined);
	}

	return this.callback(null, source);
}
