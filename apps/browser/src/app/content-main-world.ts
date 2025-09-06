import { defineUnlistedScript } from "wxt/utils/define-unlisted-script";
import { onMessage, sendMessage, setNamespace } from "webext-bridge/window";
import { VIWEB_NAMESPACE, ViwebEvent } from "@/contants";
import type { InspectMetadata } from "@viweb/code-inspector-web";

declare global {
	interface Window {
		VIWEB_LOCAL_URL: string;
		VIWEB_BROWSER_EXTENSION_API: {
			inspected: (data: { metadata: InspectMetadata }) => void;
		};
	}
}

/** this script runs in chrome content_script main world */
export default defineUnlistedScript(() => {
	setNamespace(VIWEB_NAMESPACE);

	if (window.VIWEB_LOCAL_URL) {
		sendMessage(
			ViwebEvent.WEBAPP_INIT,
			{ url: window.VIWEB_LOCAL_URL },
			"content-script",
		);
	}

	window.VIWEB_BROWSER_EXTENSION_API = {
		inspected: (data: { metadata: InspectMetadata }) => {
			sendMessage(ViwebEvent.INSPECTED, data, "content-script");
		},
	};
});
