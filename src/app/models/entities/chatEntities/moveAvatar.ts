import { h, w } from "src/app/components/chat/chat.component";
import { avatar } from "./Avatar";
import { avatarSpriteLoop } from "./avatarSpriteLoop";
import { findCllsn } from "./findCllsn";
import { structures } from "./structures";

export function moveAvatar(avatar: avatar){
	if (avatar.isMoving && avatar.canMove) {

		switch (avatar.dir) {
			case 3:
				avatar.x -= avatar.speed;
				// collision with right side of structure, collisions apply to walls as well
				if (findCllsn(avatar,structures) || avatar.x < 0) {
					avatar.x += avatar.speed;
					avatar.curFrame = 1;
				} else {
					avatarSpriteLoop(avatar);
				}
				break;
			case 0:
				avatar.y -= avatar.speed;
				// bottom side
				if (findCllsn(avatar,structures) || avatar.y < 0) {
					avatar.y += avatar.speed;
					avatar.curFrame = 1;
				} else {
					avatarSpriteLoop(avatar);
				}
				break;
			case 1:
				avatar.x += avatar.speed;
				// left side
				if (findCllsn(avatar,structures) || avatar.x + avatar.w > w) {
					avatar.x -= avatar.speed;
					avatar.curFrame = 1;
				} else {
					avatarSpriteLoop(avatar);
				}
				break;
			case 2:
				avatar.y += avatar.speed;
				// top side
				if (findCllsn(avatar,structures) || avatar.y + avatar.h > h) {
					avatar.y -= avatar.speed;
					avatar.curFrame = 1;
				} else {
					avatarSpriteLoop(avatar);
				}
				break;
			default:
				break;
		}
		
	} else {
		avatar.curFrame = 1;
	}	
  };