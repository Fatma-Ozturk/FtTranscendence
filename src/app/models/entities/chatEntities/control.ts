import { avatar } from "./Avatar";
import { chatBar } from "./chatBar";

export const control = (avatar: avatar, e: KeyboardEvent): void => {
	// avatar.dir values: 0 = up, 1 = right, 2 = down, 3 = left
	if (e && !chatBar.active) {
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