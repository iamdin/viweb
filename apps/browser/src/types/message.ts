import type { ProtocolWithReturn } from "webext-bridge";
import { ViwebEvent } from "@/contants";
import { InspectMetadata } from "@viweb/code-inspector-web";

declare module "webext-bridge" {
	export interface ProtocolMap {
		[ViwebEvent.WEBAPP_INIT]: ProtocolWithReturn<{ url: string }, void>;
		[ViwebEvent.INSPECTED]: ProtocolWithReturn<
			{ metadata: InspectMetadata },
			void
		>;
	}
}
