import { avatar } from "./Avatar";

export function avatarSpriteLoop(avatar: avatar){
	if (avatar.curFrame === avatar.frames) {
	  avatar.curFrame = 1;
	} else {
	  ++avatar.curFrame;
	}
  };
  