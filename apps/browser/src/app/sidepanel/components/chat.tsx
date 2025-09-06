import { generateUUID } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { useEffect, useState } from "react";
import { onMessage } from "webext-bridge/background";
import { ChatInput } from "./chat-input";
import { Messages } from "./messages";

export function Chat({ id }: { id: string }) {
	const [pickedElements, setPickedElements] = useState<
		{ path: string; line: number; column: number }[]
	>([]);

	useEffect(() => {
		onMessage("/devtools/pick_elements", ({ data }) => {
			setPickedElements(data.files);
		});
	}, []);

	const {
		messages,
		setMessages,
		handleSubmit,
		input,
		setInput,
		append,
		status,
		stop,
		reload,
	} = useChat({
		api: "http://localhost:9000/api/chat",
		id,
		initialMessages: [],
		experimental_throttle: 100,
		sendExtraMessageFields: true,
		generateId: generateUUID,
		// experimental_prepareRequestBody: (body) => ({
		//   id,
		//   message: body.messages,
		// }),
		onFinish: () => {
			console.log("onFinish");
		},
		onError: (error) => {
			console.log("onError", error);
		},
		body: { files: pickedElements },
	});

	return (
		<div className="flex flex-col min-w-0 h-full bg-background">
			<Messages
				chatId={id}
				status={status}
				messages={messages}
				setMessages={setMessages}
				reload={reload}
			/>

			<div className="flex flex-col gap-2 p-2">
				{pickedElements.map((element) => (
					<div key={element.file}>
						{element.file}
						{element.line}
						{element.column}
					</div>
				))}
			</div>
			<ChatInput
				chatId={id}
				attachments={[]}
				setAttachments={() => {}}
				messages={messages}
				setMessages={setMessages}
				append={append}
				handleSubmit={handleSubmit}
				input={input}
				setInput={setInput}
				status={status}
				stop={stop}
			/>
		</div>
	);
}
