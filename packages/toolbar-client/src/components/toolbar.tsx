import type React from "react";

import { useToolbar } from "@/context/toolbar";
import { cn } from "@/lib/utils";

interface ToolbarProps {
	children: React.ReactNode;
	loading?: boolean;
	error?: Error | null;
}

export function Toolbar({ children }: ToolbarProps) {
	const { toolbarRef } = useToolbar();

	return (
		<div
			ref={toolbarRef}
			className={cn(
				"fixed bottom-5 right-5 z-[2147483646] rounded-3xl flex items-center border border-border shadow-md select-none",
				"bg-white/80 backdrop-blur-lg dark:bg-gray-900/80",
			)}
		>
			{children}
		</div>
	);
}
