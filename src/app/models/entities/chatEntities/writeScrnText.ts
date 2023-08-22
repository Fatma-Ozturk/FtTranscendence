import { ctx, w } from "src/app/components/chat/chat.component";
import { chatBar } from "./chatBar";
import { screenText } from "./screenText";


export function writeScrnText(txtObj: typeof screenText) {
	if (txtObj.timer > 0) {
		if (!chatBar.showLog) {
			let adj = 2,
				fadeTime = txtObj.fadeTime,
				txtTimeFwd = txtObj.maxTime - txtObj.timer;
			
			// fade in
			if (txtTimeFwd < fadeTime) {
				ctx.globalAlpha = txtTimeFwd / fadeTime;
			}
			// fade out
			if (txtObj.timer < fadeTime) {
				ctx.globalAlpha = txtObj.timer / fadeTime;
			}
		
			ctx.fillStyle = "rgba(0,0,0,0.5)";
			ctx.fillRect(0,txtObj.y - adj - txtObj.fontS*2,w,txtObj.h + adj);
			ctx.textAlign = "left";
			ctx.font = txtObj.fontS + "px Arial";
			ctx.fillStyle = txtObj.color;
		
			let lines = txtObj.text.split("%");
			for (let l in lines) {
				const lineIndex = parseInt(l); // Dizeyi sayıya dönüştürüyoruz
				ctx.fillText(lines[l], 5, txtObj.y - adj - (txtObj.fontS * 1.5 * -(lineIndex - 1)));
			  }
			ctx.globalAlpha = 1;
		}
		
		txtObj.timer -= 1000/60;
		
		if (txtObj.timer < 0) {
			txtObj.timer = 0;
		}
	}
  }