import { VIWEB_LOCAL_URL } from "./constants";

declare global {
	interface Window {
		VIWEB_LOCAL_URL: string;
	}
}
window.VIWEB_LOCAL_URL = VIWEB_LOCAL_URL;
