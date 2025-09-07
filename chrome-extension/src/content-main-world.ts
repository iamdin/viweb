import type { InspectMetadata } from "@viweb/code-inspector-web";
import { VIWEB_EXTENSION_NAMESPACE } from "@viweb/shared/extension";
import { ViwebExtensionMessage } from "@viweb/shared/extension/message";
import { sendMessage, setNamespace } from "webext-bridge/window";

declare global {
	interface Window {
		VIWEB_LOCAL_URL: string;
		VIWEB_BROWSER_EXTENSION_API: {
			inspected: (data: { metadata: InspectMetadata }) => void;
		};
	}
}

setNamespace(VIWEB_EXTENSION_NAMESPACE);

console.log("content-main-world", window.VIWEB_LOCAL_URL);

if (window.VIWEB_LOCAL_URL) {
	sendMessage(
		ViwebExtensionMessage.WebAppInit,
		{ url: window.VIWEB_LOCAL_URL },
		"content-script",
	);
}

window.VIWEB_BROWSER_EXTENSION_API = {
	inspected: (data: { metadata: InspectMetadata }) => {
		sendMessage(ViwebExtensionMessage.Inspected, data, "content-script");
	},
};
