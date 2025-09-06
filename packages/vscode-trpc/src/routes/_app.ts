import { router } from "../index.ts";
import { chatRouter } from "./chat.ts";
import { connectionRouter } from "./connection.ts";

export const appRouter = router({
	connection: connectionRouter,
	chat: chatRouter,
});

export type AppRouter = typeof appRouter;
