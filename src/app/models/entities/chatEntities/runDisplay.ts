import { drawScreen } from "./drawScreen";

export function runDisplay() {
	drawScreen();
	setTimeout(runDisplay, 1000 / 60);
  }