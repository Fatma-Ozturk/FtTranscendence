export const screenText = {
	text: "",
	color: "#fff",
	fontS: 16,
	timer: 3000,
	maxTime: 3000,
	fadeTime: 150,
	y: 0,
	h: 32,
	updateText: function (txt: string, y: number, h: number, c: string) {
	  this.text = txt;
	  this.timer = this.maxTime;
	  this.y = y || 0;
	  this.h = h || 32;
	  this.color = c || "#fff";
	},
  };