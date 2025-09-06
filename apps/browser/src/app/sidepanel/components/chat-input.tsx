import type { UseChatHelpers } from "@ai-sdk/react";
import type { Attachment, UIMessage } from "ai";
import equal from "fast-deep-equal";
import { ArrowUpIcon, PaperclipIcon, StopCircleIcon } from "lucide-react";
import { AnimatePresence } from "motion/react";
import type React from "react";
import { memo, useCallback, useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

function PureChatInput({
	chatId,
	input,
	setInput,
	status,
	stop,
	attachments,
	setAttachments,
	setMessages,
	handleSubmit,
	className,
}: {
	chatId: string;
	input: UseChatHelpers["input"];
	setInput: UseChatHelpers["setInput"];
	status: UseChatHelpers["status"];
	stop: () => void;
	attachments: Array<Attachment>;
	setAttachments: React.Dispatch<React.SetStateAction<Array<Attachment>>>;
	messages: Array<UIMessage>;
	setMessages: UseChatHelpers["setMessages"];
	append: UseChatHelpers["append"];
	handleSubmit: UseChatHelpers["handleSubmit"];
	className?: string;
}) {
	const textareaId = useId();
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (textareaRef.current) {
			adjustHeight();
		}
	}, []);

	const adjustHeight = () => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height = `${
				textareaRef.current.scrollHeight + 2
			}px`;
		}
	};

	const resetHeight = () => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height = "98px";
		}
	};

	useEffect(() => {
		if (textareaRef.current) {
			const domValue = textareaRef.current.value;
			// Prefer DOM value over localStorage to handle hydration
			const finalValue = domValue || "";
			setInput(finalValue);
			adjustHeight();
		}
		// Only run once after hydration
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setInput]);

	const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInput(event.target.value);
		adjustHeight();
	};

	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);

	const submitForm = useCallback(() => {
		window.history.replaceState({}, "", `/chat/${chatId}`);

		handleSubmit(undefined, {
			experimental_attachments: attachments,
		});

		setAttachments([]);
		resetHeight();
	}, [attachments, handleSubmit, setAttachments, chatId]);

	useEffect(() => {
		if (status === "submitted") {
			// scrollToBottom()
		}
	}, [status]);

	return (
		<div className="relative w-full flex flex-col gap-4">
			<AnimatePresence>
				{/* {!isAtBottom && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute left-1/2 bottom-28 -translate-x-1/2 z-50"
          >
            <Button
              data-testid="scroll-to-bottom-button"
              className="rounded-full"
              size="icon"
              variant="outline"
              onClick={(event) => {
                event.preventDefault()
                // scrollToBottom()
              }}
            >
              <ArrowDown />
            </Button>
          </motion.div>
        )} */}
			</AnimatePresence>

			<div className="relative flex flex-col min-h-[38px] rounded-md border border-input px-3 py-2 text-sm outline-none transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 has-aria-invalid:border-destructive has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40">
				<textarea
					id={textareaId}
					ref={textareaRef}
					placeholder="Send a message..."
					value={input}
					onChange={handleInput}
					className="flex-1 field-sizing-content max-h-29.5 min-h-0 resize-none bg-transparent outline-none outline-hidden placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none "
					// biome-ignore lint/a11y/noAutofocus: <explanation>
					autoFocus
					onKeyDown={(event) => {
						if (
							event.key === "Enter" &&
							!event.shiftKey &&
							!event.nativeEvent.isComposing
						) {
							event.preventDefault();

							if (status !== "ready") {
								toast.error(
									"Please wait for the model to finish its response!",
								);
							} else {
								submitForm();
							}
						}
					}}
				/>
				<div className="flex flex-row justify-end">
					{/* <AttachmentsButton fileInputRef={fileInputRef} status={status} /> */}

					{status === "submitted" ? (
						<StopButton stop={stop} setMessages={setMessages} />
					) : (
						<SendButton
							input={input}
							submitForm={submitForm}
							uploadQueue={uploadQueue}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

export const ChatInput = memo(PureChatInput, (prevProps, nextProps) => {
	if (prevProps.input !== nextProps.input) return false;
	if (prevProps.status !== nextProps.status) return false;
	if (!equal(prevProps.attachments, nextProps.attachments)) return false;

	return true;
});

function PureAttachmentsButton({
	fileInputRef,
	status,
}: {
	fileInputRef: React.MutableRefObject<HTMLInputElement | null>;
	status: UseChatHelpers["status"];
}) {
	return (
		<Button
			data-testid="attachments-button"
			className="rounded-md rounded-bl-lg p-[7px] h-fit dark:border-zinc-700 hover:dark:bg-zinc-900 hover:bg-zinc-200"
			onClick={(event) => {
				event.preventDefault();
				fileInputRef.current?.click();
			}}
			disabled={status !== "ready"}
			variant="ghost"
		>
			<PaperclipIcon size={14} />
		</Button>
	);
}

const AttachmentsButton = memo(PureAttachmentsButton);

function PureStopButton({
	stop,
	setMessages,
}: {
	stop: () => void;
	setMessages: UseChatHelpers["setMessages"];
}) {
	return (
		<Button
			data-testid="stop-button"
			className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
			onClick={(event) => {
				event.preventDefault();
				stop();
				setMessages((messages) => messages);
			}}
		>
			<StopCircleIcon size={14} />
		</Button>
	);
}

const StopButton = memo(PureStopButton);

function PureSendButton({
	submitForm,
	input,
	uploadQueue,
}: {
	submitForm: () => void;
	input: string;
	uploadQueue: Array<string>;
}) {
	return (
		<Button
			data-testid="send-button"
			className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
			onClick={(event) => {
				event.preventDefault();
				submitForm();
			}}
			disabled={input.length === 0 || uploadQueue.length > 0}
		>
			<ArrowUpIcon size={14} />
		</Button>
	);
}

const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
	if (prevProps.uploadQueue.length !== nextProps.uploadQueue.length)
		return false;
	if (prevProps.input !== nextProps.input) return false;
	return true;
});
