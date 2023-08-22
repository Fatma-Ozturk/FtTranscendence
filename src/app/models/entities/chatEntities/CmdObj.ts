export class CmdObj{
	name: string;
	args: string;
	desc: string;
	constructor(name: string, args: string = "", desc: string = "") {
	this.name = name;
	this.args = args;
	this.desc = desc;
  }
}