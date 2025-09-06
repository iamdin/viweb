import { useEffect, useRef } from "react";
import { useInspectorActorRef, useInspectorActorSelector } from "../context";

export function useInspectorEvents() {
	const actorRef = useInspectorActorRef();
	const inspectState = useInspectorActorSelector((state) => state.value);
	const inspectedElement = useInspectorActorSelector(
		(state) => state.context.inspectedElement,
	);
	const rafRef = useRef<number | undefined>(undefined);

	useEffect(() => {
		if (inspectState === "idle") return;

		const handlePointerMove = (event: PointerEvent) => {
			actorRef.send({ type: "POINTER_MOVE", event });
		};
		const handlePointerDown = (event: PointerEvent) => {
			actorRef.send({ type: "POINTER_DOWN", event });
		};
		const handlePointerLeave = () => {
			actorRef.send({ type: "POINTER_LEAVE" });
		};

		document.addEventListener("pointermove", handlePointerMove, {
			capture: true,
		});
		document.addEventListener("pointerdown", handlePointerDown, {
			capture: true,
		});
		document.addEventListener("pointerleave", handlePointerLeave, {
			capture: true,
		});

		return () => {
			document.removeEventListener("pointermove", handlePointerMove, {
				capture: true,
			});
			document.removeEventListener("pointerdown", handlePointerDown, {
				capture: true,
			});
			document.removeEventListener("pointerleave", handlePointerLeave, {
				capture: true,
			});
		};
	}, [actorRef, inspectState]);

	useEffect(() => {
		if (!inspectedElement) return;

		const updateInspectedRect = () => {
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
			}
			rafRef.current = requestAnimationFrame(() => {
				actorRef.send({ type: "UPDATE_INSPECTED_RECT" });
			});
		};

		const handleResize = () => updateInspectedRect();
		const handleScroll = () => updateInspectedRect();

		window.addEventListener("resize", handleResize);
		document.addEventListener("scroll", handleScroll, { capture: true });

		return () => {
			window.removeEventListener("resize", handleResize);
			document.removeEventListener("scroll", handleScroll, { capture: true });
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
			}
		};
	}, [actorRef, inspectedElement]);
}
