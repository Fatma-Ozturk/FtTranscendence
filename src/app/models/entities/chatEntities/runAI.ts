import { npcAI } from "./npcAI";
import { npcs } from "./npcs";

export function runAI() {
	for (var ai in npcs) {
	  npcAI(npcs[ai]);
	}
	setTimeout(runAI, 400);
  }