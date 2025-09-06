import { useCallback, useEffect, useRef } from "react";

interface UseEventListenerOptions {
	debounceMs?: number;
	capture?: boolean;
	passive?: boolean;
	once?: boolean;
}

export function useEventListener<T extends keyof WindowEventMap>(
	eventType: T,
	handler: (event: WindowEventMap[T]) => void,
	target?: Window | null,
	options?: UseEventListenerOptions,
): void;

export function useEventListener<T extends keyof DocumentEventMap>(
	eventType: T,
	handler: (event: DocumentEventMap[T]) => void,
	target: Document | null,
	options?: UseEventListenerOptions,
): void;

export function useEventListener<T extends keyof HTMLElementEventMap>(
	eventType: T,
	handler: (event: HTMLElementEventMap[T]) => void,
	target: HTMLElement | null,
	options?: UseEventListenerOptions,
): void;

export function useEventListener<T extends Event>(
	eventType: string,
	handler: (event: T) => void,
	target: EventTarget | null = window,
	options: UseEventListenerOptions = {},
): void {
	const { debounceMs = 0, capture, passive, once } = options;
	const savedHandler = useRef(handler);
	const debounceTimer = useRef<number | undefined>();

	useEffect(() => {
		savedHandler.current = handler;
	}, [handler]);

	const debouncedHandler = useCallback(
		(event: T) => {
			if (debounceMs > 0) {
				if (debounceTimer.current) {
					clearTimeout(debounceTimer.current);
				}
				debounceTimer.current = window.setTimeout(() => {
					savedHandler.current(event);
				}, debounceMs);
			} else {
				savedHandler.current(event);
			}
		},
		[debounceMs],
	);

	useEffect(() => {
		if (!target) return;

		const eventOptions: AddEventListenerOptions = {
			capture,
			passive,
			once,
		};

		target.addEventListener(
			eventType,
			debouncedHandler as EventListener,
			eventOptions,
		);

		return () => {
			if (debounceTimer.current) {
				window.clearTimeout(debounceTimer.current);
			}
			target.removeEventListener(
				eventType,
				debouncedHandler as EventListener,
				eventOptions,
			);
		};
	}, [eventType, target, debouncedHandler, capture, passive, once]);
}
