import { tool } from "ai";
import { z } from "zod";

const parameters = z.object({
	command: z
		.enum(["view", "create", "str_replace", "insert"])
		.describe(
			"The commands to run. Allowed options are: `view`, `create`, `str_replace`, `insert`.",
		),
	path: z
		.string()
		.describe(
			"Absolute path to file or directory, e.g. `/repo/file.py` or `/repo`.",
		),
	/** The content to write to the new file */
	file_text: z
		.string()
		.optional()
		.describe(
			"Required parameter of `create` command, with the content of the file to be created.",
		),
	/** The line number after which to insert the text (0 for beginning of file) */
	insert_line: z
		.number()
		.int()
		.optional()
		.describe(
			"Required parameter of `insert` command. The `new_str` will be inserted AFTER the line `insert_line` of `path`.",
		),
	new_str: z
		.string()
		.optional()
		.describe(
			"Optional parameter of `str_replace` command containing the new string (if not given, no string will be added). Required parameter of `insert` command containing the string to insert.",
		),
	old_str: z
		.string()
		.optional()
		.describe(
			"Required parameter of `str_replace` command containing the string in `path` to replace.",
		),
	view_range: z
		.array(z.number().int())
		.optional()
		.describe(
			"Optional parameter of `view` command when `path` points to a file. If none is given, the full file is shown. If provided, the file will be shown in the indicated line number range, e.g. [11, 12] will show lines 11 and 12. Indexing at 1 to start. Setting `[start_line, -1]` shows all lines from `start_line` to the end of the file.",
		),
});

export const createStrReplaceEditor = <RESULT>(
	execute: (params: z.infer<typeof parameters>) => Promise<RESULT>,
) =>
	tool({
		description: `Custom editing tool for viewing, creating and editing files
* State is persistent across command calls and discussions with the user
* If \`path\` is a file, \`view\` displays the result of applying \`cat -n\`. If \`path\` is a directory, \`view\` lists non-hidden files and directories up to 2 levels deep
* The \`create\` command cannot be used if the specified \`path\` already exists as a file
* If a \`command\` generates a long output, it will be truncated and marked with \`<response clipped>\`
* The \`undo_edit\` command will revert the last edit made to the file at \`path\` (not available in text_editor_20250429)

Notes for using the \`str_replace\` command:
* The \`old_str\` parameter should match EXACTLY one or more consecutive lines from the original file. Be mindful of whitespaces!
* If the \`old_str\` parameter is not unique in the file, the replacement will not be performed. Make sure to include enough context in \`old_str\` to make it unique
* The \`new_str\` parameter should contain the edited lines that should replace the \`old_str\``,
		parameters,
		execute,
	});
