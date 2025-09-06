import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./app";

const container = document.createElement("div");
document.body.append(container);

createRoot(container).render(
	<StrictMode>
		<Suspense>
			<App />
		</Suspense>
	</StrictMode>,
);
