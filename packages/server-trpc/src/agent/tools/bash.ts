import { tool } from "ai";
import { z } from "zod";

const parameters = z.object({
	command: z
		.string()
		.describe(
			"The bash command to run. Required unless the tool is being restarted.",
		),
	restart: z
		.boolean()
		.describe(
			"Specifying true will restart this tool. Otherwise, leave this unspecified.",
		),
});

export const createBashTool = <RESULT>(
	execute: (params: z.infer<typeof parameters>) => Promise<RESULT>,
) =>
	tool({
		description: `Run commands in a bash shell
* When invoking this tool, the contents of the "command" parameter does NOT need to be XML-escaped.
* You have access to a mirror of common linux and python packages via apt and pip.
* State is persistent across command calls and discussions with the user.
* To inspect a particular line range of a file, e.g. lines 10-25, try 'sed -n 10,25p /path/to/the/file'.
* Please avoid commands that may produce a very large amount of output.
* Please run long lived commands in the background, e.g. 'sleep 10 &' or start a server in the background.`,
		parameters,
		execute,
	});
