import { z } from "zod";
import { publicProcedure } from "../index.ts";

export const connectionRouter = publicProcedure
	.input(
		z.object({
			root: z.string(),
		}),
	)
	.query(({ input, ctx }) => {
		return input.root.startsWith(ctx.workspaceFolderPath);
	});
