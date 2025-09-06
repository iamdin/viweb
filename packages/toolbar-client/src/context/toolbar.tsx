import type { DevToolbarApp } from "@/dev-toolbar";
import { appMachine } from "@/stores/app-machine";
import { InspectorProvider } from "@viweb/code-inspector-web";
import { createActorContext } from "@xstate/react";
import { useRef } from "react";

export const AppActorContext = createActorContext(appMachine);

export const DevToolbarProviders = ({
	apps,
	children,
	container,
}: {
	apps: DevToolbarApp[];
	container: HTMLDivElement;
	children: React.ReactNode;
}) => {
	const toolbarRef = useRef<HTMLDivElement>({} as HTMLDivElement);

	return (
		<AppActorContext.Provider
			options={{ input: { apps, toolbarRef, container } }}
		>
			<InspectorProvider>{children}</InspectorProvider>
		</AppActorContext.Provider>
	);
};

export const useToolbar = () => {
	const toolbarRef = AppActorContext.useSelector(
		(state) => state.context.toolbarRef,
	);
	return {
		toolbarRef,
	};
};
