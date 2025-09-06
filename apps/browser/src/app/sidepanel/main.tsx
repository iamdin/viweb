import { ORPCContextProvider } from "@/contexts/orpc-context.jsx";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";

import "@/globals.css";
import "./style.css";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
