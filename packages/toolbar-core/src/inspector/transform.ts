import { transform as babelTransform } from "@babel/core";
import invariant from "tiny-invariant";
import { InspectorBabelPlugin } from "./babel";

export interface TransformOptions {
	/**
	 * root path of project
	 */
	rootPath?: string;
	/**
	 * absolute path of source file
	 */
	absolutePath?: string;
	/**
	 * relative path of source file
	 */
	relativePath?: string;
}

export const transform = (
	code: string,
	{ rootPath, absolutePath, relativePath }: TransformOptions,
) => {
	invariant(
		(rootPath && absolutePath) || relativePath,
		"both rootPath and absolutePath or relativePath is required",
	);
	// use babel transform
	return babelTransform(code, {
		filename: absolutePath, // pass filename to babel, so state.filename has value
		parserOpts: {
			sourceType: "module",
			allowUndeclaredExports: true,
			allowImportExportEverywhere: true,
			plugins: ["jsx", "typescript"],
		},
		plugins: [InspectorBabelPlugin({ rootPath, relativePath })],
		generatorOpts: {
			retainLines: true,
		},
	});

	// backup parse/traverse/generate method (verified to work)
	// const ast: Node = parse(code, {
	// 	sourceType: "module",
	// 	allowUndeclaredExports: true,
	// 	allowImportExportEverywhere: true,
	// 	plugins: ["jsx", "typescript", ...(options?.babelPlugins ?? [])],
	// 	...options?.babelOptions,
	// });

	// traverse(ast, createTransformVisitor({ relativePath }));

	// return generate(ast, { retainLines: true });
};
