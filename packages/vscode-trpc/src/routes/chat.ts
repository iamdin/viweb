import { z } from "zod";
import { publicProcedure, router } from "../index.ts";

const CURSOR_PROMPT_PREFIX = `Ah, sorry, it wasn't an error. The user has submitted a change request. Here is the request, please implement it:
`;

export const chatRouter = router({
	call_agent: publicProcedure
		.input(
			z.object({
				message: z.string().min(1),
				files: z.array(
					z.object({
						path: z.string(),
						line: z.number(),
						column: z.number(),
					}),
				),
			}),
		)
		.mutation(({ input, ctx }) => {
			const promptWithPrefix = `${CURSOR_PROMPT_PREFIX}\n${input.message}`;
			ctx.composerFixErrorMessage({
				prompt: promptWithPrefix,
				files: input.files,
			});
		}),
});
