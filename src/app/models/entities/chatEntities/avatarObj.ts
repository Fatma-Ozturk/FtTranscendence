export class avatarObj {
	name: string;
	gender: any;
	skinTone: any;
	w: number;
	h: number;
	speed: number;
	curFrame: number;
	frames: number;
	dir: number;
	isMoving: boolean;
	canMove: boolean;
	x: number;
	y: number;
	lvl: number;
	lastMsg: string;
	msgTimer: number;
	msgMaxTime: number;
	msgFadeTime: number;

	constructor(
		name: string,
		gender: any,
		skinTone: any,
		w: number,
		h: number,
		speed: number,
		frames: number,
		dir: number,
		x: number,
		y: number,
		lvl: number,
	) {
		const nameLenLimit = 16;
		this.name = name.length > nameLenLimit ? name.substr(0, nameLenLimit) : name || "Anonymous";
		this.gender = gender || 0;
		this.skinTone = skinTone || 0;
		this.w = w || 0;
		this.h = h || 0;
		this.speed = speed || 0;
		this.curFrame = 1;
		this.frames = frames || 1;
		this.dir = dir || null;
		this.isMoving = false;
		this.canMove = true;
		this.x = x || 0;
		this.y = y || 0;
		this.lvl = lvl || 0;
		this.lastMsg = "";
		this.msgTimer = 0;
		this.msgMaxTime = 3000;
		this.msgFadeTime = 150;
	}

	sendMsg(msg: string) {

		if (msg.length > 0) {
			let isCmd = false;
			// update last message if not a command
			if (msg[0] != "/") {
				this.lastMsg = msg;
			} else {
				isCmd = true;
			}
			this.msgTimer = this.msgMaxTime;
		}
	};
}