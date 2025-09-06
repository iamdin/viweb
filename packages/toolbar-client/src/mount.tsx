import { EnvironmentProvider } from "@ark-ui/react/environment";
import { Fragment, StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { DevToolbarProviders } from "@/context/toolbar";
import { InspectorIndicator } from "@viweb/code-inspector-web";

import { ToolbarIndicator } from "./App";
import type { DevToolbarApp } from "./dev-toolbar";
import style from "./index.css?inline";

const MOUNT_ELEMENT_ID = "viweb-toolbar";

export function mount(apps: DevToolbarApp[]) {
	const host = document.createElement(MOUNT_ELEMENT_ID);
	host.setAttribute("id", MOUNT_ELEMENT_ID);
	host.setAttribute("data-inspector-ignore", "true");
	document.body.appendChild(host);

	const shadowRoot = host.attachShadow({ mode: "open" });

	// style
	const shadowSheet = new CSSStyleSheet();
	shadowSheet.replaceSync(style.replace(/:root/gu, ":host"));
	shadowRoot.adoptedStyleSheets = [shadowSheet];

	// fix tailwindcss issue https://github.com/tailwindlabs/tailwindcss/issues/15005#issuecomment-2737489813
	const properties = [];
	for (const rule of shadowSheet.cssRules) {
		if (rule instanceof CSSPropertyRule) {
			if (rule.initialValue) {
				properties.push(`${rule.name}: ${rule.initialValue}`);
			}
		}
	}
	shadowSheet.insertRule(`:host { ${properties.join("; ")} }`);

	const container = document.createElement("div");
	shadowRoot.appendChild(container);
	createRoot(container).render(
		<StrictMode>
			<EnvironmentProvider value={shadowRoot}>
				<DevToolbarProviders container={container} apps={apps}>
					<ToolbarIndicator />
					{apps.map((app) => (
						<Fragment key={app.id}>{app.setup()}</Fragment>
					))}
					{/* inspector always show */}
					<InspectorIndicator />
				</DevToolbarProviders>
			</EnvironmentProvider>
		</StrictMode>,
	);
}
