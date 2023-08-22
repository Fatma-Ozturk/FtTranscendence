import { avatar } from "./Avatar";
import { randNum } from "./randNum";

export function npcAI(npc: avatar) {
	if (npc.lvl > 0) {
	  npc.isMoving = randNum(0, npc.lvl + 1) === 0 ? false : true;
	  // just like player, NPCs can chat if not moving
	  if (npc.isMoving) {
		npc.dir = randNum(0, 4);
	  } else {
		const msgs = ["😆", "😊", "😴", "❤️"];
		const msgChance = 0.05 * npc.lvl;
		const numFromBag = +Math.random().toFixed(2);
  
		if (numFromBag < msgChance) {
		  npc.sendMsg(msgs[randNum(0, msgs.length)]);
		}
	  }
	}
  };