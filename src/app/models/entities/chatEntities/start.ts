import { chatBar } from "./chatBar";
import { createNPCs } from "./createNPCs";
import { npcs } from "./npcs";
import { player } from "./player";
import { runAI } from "./runAI";
import { runDisplay } from "./runDisplay";
import { screenText } from "./screenText";
import { structures } from "./structures";
import { worldObjs } from "./worldObjs";
import { h } from "src/app/components/chat/chat.component";

export function start() {
	chatBar.create();
	createNPCs();
	// load player and NPCs
	worldObjs[0] = player;
	
	for (var sn in npcs) {
		const numericSn = +sn + 1;
		worldObjs[numericSn] = npcs[numericSn - 1];
	  }
	  
	// load structures
	let avatars = worldObjs.length;
	for (var ss in structures) {
		var numericSs = +ss + avatars;
		worldObjs[numericSs] = structures[numericSs - avatars];
	  }
	  
	// onboarding
	let onboardingTxt = "Welcome! To get started, enter /help for commands.",
		chatLog = document.querySelector(".chat-log"),
		newEntry = document.createElement("span");

	newEntry.className = "info-text";
	newEntry.appendChild(document.createTextNode(onboardingTxt));
	chatLog.insertBefore(newEntry, chatLog.childNodes[0]);
	screenText.updateText(onboardingTxt,h - chatBar.barH,screenText.fontS*2,"#ff4");
	// run everything!
	runAI();
	runDisplay();
  }