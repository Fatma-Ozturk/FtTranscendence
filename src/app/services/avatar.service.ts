import { Injectable } from '@angular/core';
import { StructuresService } from './structures.service';
import { BubbleObj } from '../models/entities/chatEntities/BubbleObj';
import { CmdService } from './cmd.service';
import { avatarObj } from '../models/entities/chatEntities/avatarObj';
import { randNum } from '../models/entities/chatEntities/randNum';
import { findCllsn } from '../models/entities/chatEntities/findCllsn';
import { TextService } from './text.service';
import { ChatBarObj } from '../models/entities/chatEntities/chatBarObj';

@Injectable({
	providedIn: 'root'
})
export class AvatarService {
	private chatBarObj: ChatBarObj;

	constructor(private structuresService: StructuresService,
		private cmdService: CmdService,
		private textService: TextService) {
		this.chatBarObj = new ChatBarObj();
		this.imgF = new Image();
		this.imgM = new Image();

		this.imgM.src = "https://i.ibb.co/59SRcxm/chibi-m.png";
		this.imgF.src = "https://i.ibb.co/PChphHS/chibi-f.png";
	}

	imgF: HTMLImageElement;
	imgM: HTMLImageElement;


	stopControl(avatar: avatarObj) {
		avatar.isMoving = false;
	};

	control = (avatar: avatarObj, e: KeyboardEvent): void => {
		// avatar.dir values: 0 = up, 1 = right, 2 = down, 3 = left
		if (e && !this.chatBarObj.active) {
			avatar.isMoving = true;
			avatar.canMove = true;
			switch (e.keyCode) {
				case 37:
					avatar.dir = 3;
					break;
				case 38:
					avatar.dir = 0;
					break;
				case 39:
					avatar.dir = 1;
					break;
				case 40:
					avatar.dir = 2;
					break;
				default:
					avatar.canMove = false;
					break;
			}
		}
	};

	avatarSpriteLoop(avatar: avatarObj) {
		if (avatar.curFrame === avatar.frames) {
			avatar.curFrame = 1;
		} else {
			++avatar.curFrame;
		}
	};

	moveAvatar(avatar: avatarObj, player: avatarObj, w: number, h: number) {

		if (avatar.isMoving && avatar.canMove) {

		 	switch (avatar.dir) {
				case 3:
					avatar.x -= avatar.speed;
					// collision with right side of structure, collisions apply to walls as well
					if (findCllsn(avatar, this.structuresService.structures) || avatar.x < 0) {
						avatar.x += avatar.speed;
						avatar.curFrame = 1;
					} else {
						this.avatarSpriteLoop(avatar);
					}
					break;
				case 0:
					avatar.y -= avatar.speed;
					// bottom side
					if (findCllsn(avatar, this.structuresService.structures) || avatar.y < 0) {
						avatar.y += avatar.speed;
						avatar.curFrame = 1;
					} else {
						this.avatarSpriteLoop(avatar);
					}
					break;
				case 1:
					avatar.x += avatar.speed;
					// left side
					if (findCllsn(avatar, this.structuresService.structures) || avatar.x + avatar.w > w) {
						avatar.x -= avatar.speed;
						avatar.curFrame = 1;
					} else {
						this.avatarSpriteLoop(avatar);
					}
					break;
				case 2:
					avatar.y += avatar.speed;
					// top side
					if (findCllsn(avatar, this.structuresService.structures) || avatar.y + avatar.h > h) {
						avatar.y -= avatar.speed;
						avatar.curFrame = 1;
					} else {
						this.avatarSpriteLoop(avatar);
					}
					break;
				default:
					break;
			}

		} else {
			avatar.curFrame = 1;
		}
	}

	drawAvatar(avatar: avatarObj, player: avatarObj, ctx: CanvasRenderingContext2D) {
		let lastMsg = avatar.lastMsg;
		// chat bubble
		if (lastMsg.length > 0 && avatar.msgTimer > 0) {
			let fontS = 16,
				fadeTime = avatar.msgFadeTime,
				latinPat = /\w+/,
				isNotLatin = !latinPat.test(lastMsg) ? true : false,
				lineLimit = 16,
				line = [""],
				lines = line.length,
				longestLnLen = 4,
				strS = !isNotLatin ? lastMsg.split(" ") : lastMsg;

			// break up message into lines
			for (let lm of strS) {
				let l = line.length - 1;
				line[l] += (lm + (lm !== strS[strS.length - 1] && !isNotLatin ? " " : ""));

				if (line[l].length > lineLimit) {
					if (line[l].length > longestLnLen) {
						longestLnLen = line[l].length;
					}
					++lines;
					line[lines - 1] = "";
				}
			}

			// for one line only, make its current length the longest
			if (lines == 1) {
				longestLnLen = line[0].length;
			}
			// cut off last line if empty
			if (line[line.length - 1] == "") {
				line.pop();
				--lines;
			}
			// fade in
			let msgTimeFwd = avatar.msgMaxTime - avatar.msgTimer;
			if (msgTimeFwd < fadeTime) {
				ctx.globalAlpha = msgTimeFwd / fadeTime;
			}
			// fade out
			if (avatar.msgTimer < fadeTime) {
				ctx.globalAlpha = avatar.msgTimer / fadeTime;
			}
			let wMult = !isNotLatin ? 0.7 : 1.2,
				bubble = new BubbleObj(lastMsg, longestLnLen * fontS * wMult, avatar.x + avatar.w / 2, avatar.y - avatar.h - 35);

			ctx.fillStyle = "rgba(255,255,255,0.85)";
			// oval
			ctx.beginPath();
			let bubbleY = bubble.y - (fontS * (lines - 1)),
				bubbleH = fontS * 3 * lines,
				bottomLnSt = (fontS * 0.6) * (lines - 1);
			// top half
			ctx.moveTo(bubble.x - bubble.w / 2, bubbleY);
			ctx.bezierCurveTo(bubble.x - bubble.w / 2, bubbleY - bubbleH / 2, (bubble.x - bubble.w / 2) + bubble.w, bubbleY - bubbleH / 2, (bubble.x - bubble.w / 2) + bubble.w, bubbleY);
			// bottom half
			ctx.moveTo(bubble.x - bubble.w / 2, bubbleY);
			ctx.quadraticCurveTo(bubble.x - bubble.w / 2, bubbleY + bubbleH / 4, bubble.x - 5, bubbleY + bubbleH / 3);
			ctx.lineTo(bubble.x, bubbleY + (fontS * 2 * lines) - (fontS * (lines - 1)));
			ctx.lineTo(bubble.x + 5, bubbleY + bubbleH / 3);
			ctx.quadraticCurveTo(bubble.x + bubble.w / 2, bubbleY + bubbleH / 4, bubble.x + bubble.w / 2, bubbleY);
			ctx.fill();
			ctx.closePath();
			// text
			ctx.fillStyle = "#000";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.font = fontS + "px Arial";
			for (const value of line) {
				const bl = line.indexOf(value);
				ctx.fillText(line[line.length - 1 - bl], bubble.x, bubbleY + bottomLnSt - ((fontS * 1.2) * bl));
			}

			ctx.globalAlpha = 1;

			avatar.msgTimer -= 1000 / 60;
			if (avatar.msgTimer < 0) {
				avatar.msgTimer = 0;
			}
		}
		// avatar shadow
		ctx.fillStyle = "rgba(0,0,0,0.25)";
		ctx.beginPath();
		ctx.moveTo(avatar.x, avatar.y);
		ctx.bezierCurveTo(avatar.x + avatar.w / 5, avatar.y - avatar.w / 3, avatar.x + avatar.w / (5 / 4), avatar.y - avatar.w / 3, avatar.x + avatar.w, avatar.y);
		ctx.moveTo(avatar.x, avatar.y);
		ctx.bezierCurveTo(avatar.x + avatar.w / 5, avatar.y + avatar.w / 3, avatar.x + avatar.w / (5 / 4), avatar.y + avatar.w / 3, avatar.x + avatar.w, avatar.y);
		ctx.fill();
		ctx.closePath();
		// avatar
		ctx.drawImage(
			avatar.gender == 1 ? this.imgF : this.imgM,
			avatar.w * (avatar.curFrame - 1) + (avatar.w * avatar.frames * avatar.dir),
			avatar.h * avatar.skinTone,
			avatar.w,
			avatar.h,
			avatar.x,
			avatar.y - avatar.h,
			avatar.w,
			avatar.h
		);
		// name
		ctx.textAlign = "center";
		ctx.textBaseline = "top";
		ctx.font = "14px Arial";
		ctx.fillText(avatar.name, avatar.x + avatar.w / 2, avatar.y + 4);
		ctx.fillStyle = avatar.name == player.name ? "#ff4" : "#fff";
		ctx.fillText(avatar.name, avatar.x + avatar.w / 2, avatar.y + 3);
	}

	npcAI(npc: avatarObj, player: avatarObj, npcs: any[], worldObjs: any[], h: number, canvas: HTMLCanvasElement) {
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
					//npc.sendMsg(msgs[randNum(0, msgs.length)], npcs, worldObjs, canvas);
					npc.sendMsg(msgs[randNum(0, msgs.length)]);
				}
			}
		}
	};

}
