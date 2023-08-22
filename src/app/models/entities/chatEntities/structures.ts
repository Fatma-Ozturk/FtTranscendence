import { h, w } from "src/app/components/chat/chat.component";
import { Structure } from "./Structure";
import { chatBar } from "./chatBar";
import { images } from "./sprites";

export const structures = [
	new Structure(w, 50, 0, -40, 0, null, false, 1),
	new Structure(10, h - chatBar.barH - 10, 0, 10, 0, null, false, 1),
	new Structure(10, h - chatBar.barH - 10, w - 10, 10, 0, null, false, 1),
	new Structure(300, 200, w / 2 - 150, 100, 70, images[1], true, 12)
	
  ];