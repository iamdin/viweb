import fs from "node:fs/promises";
import { z } from "zod/v4";
import { publicProcedure, router } from "../index.ts";

export const fileRouter = router({
	readFile: publicProcedure
		.input(
			z.object({
				filePath: z.string(),
			}),
		)
		.query(async ({ input: { filePath } }) => {
			return fs.readFile(filePath, "utf-8");
		}),
	writeFile: publicProcedure
		.input(
			z.object({
				filePath: z.string(),
				content: z.string(),
			}),
		)
		.mutation(async ({ input: { filePath, content } }) => {
			return fs.writeFile(filePath, content, "utf-8");
		}),
});
