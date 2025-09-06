import { router } from "../index.ts";
import { connectionRouter } from "./connection.ts";
import { fileRouter } from "./file.ts";

export const appRouter = router({
	connection: connectionRouter,
	file: fileRouter,
});

export type AppRouter = typeof appRouter;
