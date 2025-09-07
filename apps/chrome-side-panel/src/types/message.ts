import type { InspectMetadata } from "@viweb/code-inspector-web";
import { ViwebExtensionMessage } from "@viweb/shared/extension/message";
import type { ProtocolWithReturn } from "webext-bridge";

declare module "webext-bridge" {
	export interface ProtocolMap {
		[ViwebExtensionMessage.WebAppInit]: ProtocolWithReturn<
			{ url: string },
			void
		>;
		[ViwebExtensionMessage.Inspected]: ProtocolWithReturn<
			{ metadata: InspectMetadata },
			void
		>;
	}
}
