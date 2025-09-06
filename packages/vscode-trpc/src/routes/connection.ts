import { z } from "zod";
import { publicProcedure, router } from "../index.ts";

export const connectionRouter = router({
	/**
	 * Check if the root is in the workspace folders paths
	 */
	health: publicProcedure.input(z.string()).query(({ input, ctx }) => {
		return ctx.workspaceFoldersPaths.some((path) => input.startsWith(path));
	}),
});
