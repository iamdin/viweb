export interface Context {
	workspaceFoldersPaths: string[];
	composerFixErrorMessage: (options: {
		prompt: string;
		files: {
			path: string;
			line: number;
			column: number;
		}[];
	}) => void;
}
