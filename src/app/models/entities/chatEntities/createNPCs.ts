import { h, w } from "src/app/components/chat/chat.component";
import { avatar } from "./Avatar";
import { chatBar } from "./chatBar";
import { findCllsn } from "./findCllsn";
import { npcs } from "./npcs";
import { player } from "./player";
import { randNum } from "./randNum";
import { structures } from "./structures";

export function createNPCs() {
	const NameObj = (name: string, gender: string) => ({
		name: name,
		gender: gender
	  }),
	  
	   npcNames = [
		NameObj("Alice", "female"),
		NameObj("Jack", "male"),
		NameObj("Jill", "female")
	  ],
	  
  
	avatarW = 30,
	avatarH = 60;
  
	for (const npcn in npcNames) {
	  let chooseSkin = randNum(0, 3),
	   placeX = randNum(0, w - avatarW),
	   placeY = randNum(avatarH, h - chatBar.barH - avatarH);
  
	  npcs[npcn] = new avatar(
		npcNames[npcn].name,
		npcNames[npcn].gender,
		chooseSkin,
		avatarW,
		avatarH,
		3,
		28,
		2,
		placeX,
		placeY,
		8
	  );
  
	  if (findCllsn(npcs[npcn], structures)) {
		npcs[npcn].x = player.x;
		npcs[npcn].y = player.y;
	  }
	}
  }
  