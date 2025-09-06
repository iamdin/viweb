import { mount } from "./mount";

export type DevToolbarApp = {
	id: string;
	name: string;
	icon: () => React.ReactNode;
	type: "inspector";
	setup: () => React.ReactNode;
};

export const defineDevToolbarApp = (app: DevToolbarApp) => app;

class VibeDevToolbar {
	private apps: DevToolbarApp[] = [];

	registerApp(app: DevToolbarApp) {
		this.apps.push(app);
	}

	mount() {
		mount(this.apps);
	}
}

const vibeDevToolbar = new VibeDevToolbar();

export default vibeDevToolbar;
