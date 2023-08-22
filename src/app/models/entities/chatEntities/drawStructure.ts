import { ctx } from "src/app/components/chat/chat.component";
import { Structure } from "./Structure";

export function drawStructure(strctr: Structure) {
	if (strctr.img === null) {
		ctx.fillStyle = "#aaa";
		ctx.fillRect(strctr.x,strctr.y,strctr.w,strctr.h);
	} else if (strctr.isAnim) {
		
		ctx.drawImage(strctr.img,strctr.w*(strctr.curFrame - 1),0,strctr.w,strctr.h,strctr.x,strctr.y-strctr.backArea,strctr.w,strctr.h);
		++strctr.curFrame;
		if (strctr.curFrame > strctr.frames) {
			strctr.curFrame = 1;
		}
	} else {
		ctx.drawImage(strctr.img,strctr.x,strctr.y,strctr.w,strctr.h);
	}
  }