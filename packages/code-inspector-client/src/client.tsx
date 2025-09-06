import {
	InspectorIndicator,
	InspectorProvider,
} from "@viweb/code-inspector-web";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import style from "./index.css?inline";

const MOUNT_ELEMENT_ID = "vibe-dev-code-inspector";

export function mount() {
	const host = document.createElement("vibe-dev-code-inspector");
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
			<InspectorProvider>
				<InspectorIndicator />
			</InspectorProvider>
		</StrictMode>,
	);
}

mount();
