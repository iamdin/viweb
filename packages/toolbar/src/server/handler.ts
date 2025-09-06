import { RPCHandler } from "@orpc/server/node";
import { chatRouter } from "@viweb/server-trpc/orpc";

export const handler = new RPCHandler(chatRouter);
