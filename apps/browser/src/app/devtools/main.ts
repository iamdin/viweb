import { browser } from "wxt/browser";

// 创建主要的DevTools面板
browser.devtools.panels.create(
	"VibeCoding DevTools",
	"icon/128.png",
	"devtools-panel.html",
);

browser.devtools.panels.elements
	.createSidebarPane("Example Pane")
	.then((pane) => {
		pane.setPage("devtools-pane.html");
	});
