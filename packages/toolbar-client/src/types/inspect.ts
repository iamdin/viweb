export interface InspectElement {
	/** unique id of the element, file:line:column */
	id: string;
	file: string;
	line: number;
	column: number;
	rect: DOMRect;
}
