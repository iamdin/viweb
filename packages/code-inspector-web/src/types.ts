export interface InspectDataset {
	id?: string;
	[key: string]: string | undefined;
}

export interface InspectMetadata {
	fileName?: string;
	lineNumber?: number;
	columnNumber?: number;
	componentName: string;
}
