export class ChatBarObj {
	barH: number;
	logH: number;
	margin: number;
	active: boolean;
	showLog: boolean;
	maxLines: number;
	history: any[];
	curHistoryItem: number;
	curAutoCmpltCmd: number;
	arg1pg: number;
	arg2pg: number;
	autoCmpltLvl: number;
  
	constructor() {
	  this.barH = 54;
	  this.logH = 220;
	  this.margin = 5;
	  this.active = false;
	  this.showLog = false;
	  this.maxLines = 32;
	  this.history = [];
	  this.curHistoryItem = -1;
	  this.curAutoCmpltCmd = -1;
	  this.arg1pg = -1;
	  this.arg2pg = -1;
	  this.autoCmpltLvl = 0;
	}
  }
  