import { os, streamToEventIterator, type } from "@orpc/server";
import { type UIMessage, convertToModelMessages, streamText } from "ai";
import { claudeCode } from "ai-sdk-provider-claude-code";

const orpc = os.$context();

export const chatRouter = orpc.router({
	chat: orpc
		.input(type<{ chatId: string; messages: UIMessage[] }>())
		.handler(({ input }) => {
			console.log("chat", input);
			const result = streamText({
				model: claudeCode("sonnet"),
				system: "You are a helpful assistant.",
				messages: convertToModelMessages(input.messages),
			});

			return streamToEventIterator(result.toUIMessageStream());
		}),
});

export type ChatRouter = typeof chatRouter;
