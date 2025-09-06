import { defineDevToolbarApp } from "@/dev-toolbar";
import { MousePointerClickIcon } from "lucide-react";
import CallIDE from "./app";

export const callIde = defineDevToolbarApp({
	id: "call-ide",
	name: "Call IDE",
	icon: () => <MousePointerClickIcon />,
	type: "inspector",
	setup: () => <CallIDE />,
});
