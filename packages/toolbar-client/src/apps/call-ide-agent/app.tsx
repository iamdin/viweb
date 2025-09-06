import { Button } from "@/components/ui/button";
import { AppActorContext } from "@/context/toolbar";
import { vscodeTrpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import {
	FloatingFocusManager,
	FloatingPortal,
	autoUpdate,
	flip,
	offset,
	shift,
	useDismiss,
	useFloating,
	useInteractions,
	useRole,
} from "@floating-ui/react";
import {
	useInspectorActorRef,
	useInspectorActorSelector,
} from "@viweb/code-inspector-web";
import { ArrowUpIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function PromptToIDE() {
	const [prompt, setPrompt] = useState("");
	const toolbarRef = AppActorContext.useSelector(
		(state) => state.context.toolbarRef,
	);
	const inspectedElementRect = useInspectorActorSelector(
		(state) => state.context.inspectedElementRect,
	);
	const inspectedElementMetadata = useInspectorActorSelector(
		(state) => state.context.inspectedElementMetadata,
	);

	const inspectActorRef = useInspectorActorRef();

	const open = Boolean(inspectedElementRect && inspectedElementMetadata);
	console.log("open", open);
	const { refs, floatingStyles, context, placement } = useFloating({
		open,
		placement: "left-start",
		strategy: "fixed",
		middleware: [
			offset({ mainAxis: 5, alignmentAxis: 4 }),
			flip({
				fallbackPlacements: ["bottom"],
			}),
			shift({ padding: 10 }),
		],
		whileElementsMounted: autoUpdate,
	});
	const { getFloatingProps } = useInteractions([
		useDismiss(context),
		useRole(context),
	]);

	// Set toolbar as reference
	useEffect(() => {
		if (toolbarRef?.current) {
			refs.setReference(toolbarRef.current);
		}
	}, [refs, toolbarRef]);

	const handleSubmit = () => {
		if (!inspectedElementMetadata) return;
		vscodeTrpc.chat.call_agent.mutate({
			message: prompt,
			files: [
				{
					path: inspectedElementMetadata.fileName,
					line: Number(inspectedElementMetadata.lineNumber),
					column: Number(inspectedElementMetadata.columnNumber),
				},
			],
		});
	};

	const handleClose = () => {
		inspectActorRef.send({ type: "STOP" });
	};

	if (!toolbarRef?.current) return null;

	const isLeft =
		placement === "left" ||
		placement === "left-start" ||
		placement === "left-end";

	return (
		<FloatingPortal>
			{open && (
				<FloatingFocusManager context={context} modal={false}>
					<div
						ref={refs.setFloating}
						style={floatingStyles}
						{...getFloatingProps()}
						data-side={placement}
						className={cn(
							"z-[2147483647] bg-popover text-popover-foreground rounded-md border p-4 shadow-lg",
							"w-80 max-h-[80vh] overflow-y-auto",
							// Animations
							isLeft
								? "animate-in slide-in-from-left-2 fade-in-0"
								: "animate-in slide-in-from-right-2 fade-in-0",
							"duration-200",
						)}
					>
						<div className="grid gap-4">
							{/* Header */}
							<div className="flex items-center justify-between">
								<h3 className="text-sm font-semibold">Prompt to IDE</h3>
								<Button
									variant="ghost"
									size="icon"
									aria-label="Close"
									className="size-6 cursor-pointer text-muted-foreground/70"
									onClick={handleClose}
								>
									<XIcon size={16} aria-hidden="true" />
								</Button>
							</div>

							{/* Content */}
							<div className="grid gap-2">
								<textarea
									placeholder="Enter your prompt"
									value={prompt}
									onChange={(e) => setPrompt(e.target.value)}
									className={cn(
										"placeholder:text-muted-foreground/70 flex min-h-0 w-full bg-transparent text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50",
										"field-sizing-content max-h-29.5 resize-none",
										"p-2 border rounded-md",
									)}
									onKeyDown={(e) => {
										if (e.key === "Enter" && !e.shiftKey) {
											e.preventDefault();
											handleSubmit();
										}
									}}
								/>

								<Button
									aria-label="Send"
									className="w-full"
									onClick={handleSubmit}
									disabled={!prompt.trim()}
								>
									<ArrowUpIcon className="mr-2 size-4" />
									Send
								</Button>
							</div>
						</div>
					</div>
				</FloatingFocusManager>
			)}
		</FloatingPortal>
	);
}
