import {
	INSPECTOR_ATTRIBUTE_DATA_KEY,
	INSPECTOR_NAME_ATTRIBUTE_DATA_KEY,
} from "./constants";
import type { InspectMetadata } from "./types";

const getInspector = (el: HTMLElement) => {
	const data = el.getAttribute(INSPECTOR_ATTRIBUTE_DATA_KEY);
	if (!data) return null;

	const splitRE = /(.+):([\d]+):([\d]+)$/;
	const match = data.match(splitRE);
	if (!match) return null;

	const [_, fileName, line, column] = match;
	return {
		fileName,
		lineNumber: Number(line),
		columnNumber: Number(column),
	};
};

const getInspectorComponentName = (el: HTMLElement) => {
	return el.getAttribute(INSPECTOR_NAME_ATTRIBUTE_DATA_KEY);
};

export const getInspectorMetadata = (
	el: HTMLElement,
): InspectMetadata | null => {
	const inspector = getInspector(el);
	if (!inspector) return null;

	return {
		...inspector,
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		componentName: getInspectorComponentName(el)!,
	};
};

export const isHTMLElement = (node: EventTarget): node is HTMLElement =>
	node instanceof HTMLElement;

export const tryInspectElement = (
	e: PointerEvent | MouseEvent,
	inspectedElement?: HTMLElement,
) => {
	const path = e.composedPath();
	if (!path) return;
	for (const element of path) {
		if (isHTMLElement(element)) {
			if (inspectedElement?.contains(element)) {
				return;
			}
			const metadata = getInspectorMetadata(element);
			if (metadata) {
				return {
					element,
					metadata,
				};
			}
		}
	}
};
