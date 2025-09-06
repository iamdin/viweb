import { VIWEB_NAMESPACE, ViwebEvent } from "@/contants";
import {
	allowWindowMessaging,
	onMessage,
	sendMessage,
} from "webext-bridge/content-script";
import { defineContentScript } from "wxt/utils/define-content-script";
import { injectScript } from "wxt/utils/inject-script";

export default defineContentScript({
	matches: ["<all_urls>"],
	runAt: "document_end",

	async main() {
		await injectScript("/content-main-world.js");

		allowWindowMessaging(VIWEB_NAMESPACE);
		// proxy, content-script window -> sidepanel
		onMessage(ViwebEvent.WEBAPP_INIT, async (event) => {
			return await sendMessage(ViwebEvent.WEBAPP_INIT, event.data, "sidepanel");
		});
		onMessage(ViwebEvent.INSPECTED, async (event) => {
			return await sendMessage(ViwebEvent.INSPECTED, event.data, "sidepanel");
		});
	},
});
