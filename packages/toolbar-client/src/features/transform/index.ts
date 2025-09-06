import type {
	TransformOptions as BabelTransformOptions,
	PluginObj,
} from "@babel/core";
import { transform as babelTransform, packages } from "@babel/standalone";
import type * as t from "@babel/types";
const babelTypes = packages.types;

type TransformOptions = Omit<
	BabelTransformOptions,
	"lineNumber" | "columnNumber"
>;

export async function transform({
	code,
	options,
}: {
	code: string;
	options?: TransformOptions;
}) {
	// const result = await import('@babel/standalone')
	return babelTransform(code, {
		parserOpts: {
			sourceType: "module",
			allowUndeclaredExports: true,
			allowImportExportEverywhere: true,
			plugins: ["typescript", "jsx", "classProperties"],
		},
		generatorOpts: {
			minified: false,
			retainLines: true,
			jsescOption: {
				minimal: false,
			},
		},
		...options,
	});
}

function addAttributesToJSXElement(
	node: t.JSXOpeningElement,
	attributes: Record<string, string>,
) {
	// Create a map of existing attribute names to their indices
	const existingAttrs = new Map<string, number>();
	node.attributes.forEach(
		(attr: t.JSXAttribute | t.JSXSpreadAttribute, index: number) => {
			if (
				babelTypes.isJSXAttribute(attr) &&
				babelTypes.isJSXIdentifier(attr.name)
			) {
				existingAttrs.set(attr.name.name, index);
			}
		},
	);

	// Process each new attribute
	for (const [key, value] of Object.entries(attributes)) {
		const newAttribute = babelTypes.jsxAttribute(
			babelTypes.jsxIdentifier(key),
			babelTypes.stringLiteral(value),
		);

		const existingIndex = existingAttrs.get(key);
		if (existingIndex !== undefined) {
			// Override existing attribute
			node.attributes[existingIndex] = newAttribute;
		} else {
			// Add new attribute
			node.attributes.push(newAttribute);
		}
	}
}

export function babelPluginTransformComponentProps({
	lineNumber,
	columnNumber,
	data,
}: {
	lineNumber: number;
	columnNumber: number;
	data: Record<string, string>;
}): PluginObj {
	return {
		visitor: {
			JSXOpeningElement: {
				enter(path) {
					const node = path.node;

					if (babelTypes.isJSXNamespacedName(node.name)) {
						return;
					}
					if (
						(babelTypes.isJSXIdentifier(node.name) &&
							node.name.name.endsWith("Fragment")) ||
						(babelTypes.isJSXMemberExpression(node.name) &&
							node.name.property.name.endsWith("Fragment"))
					) {
						return;
					}

					const line = node.loc?.start.line;
					const column = node.loc?.start.column;
					// TODO: current we assume the line and column is the same as the component
					if (line === lineNumber && column === columnNumber) {
						addAttributesToJSXElement(node, data);
					}
				},
			},
		},
	};
}
