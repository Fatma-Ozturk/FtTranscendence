export var sprites = [
	"https://i.ibb.co/TqMC0Dp/grass.png",
	"https://i.ibb.co/GTsDmJF/fountain.png",
	"https://i.ibb.co/59SRcxm/chibi-m.png",
	"https://i.ibb.co/PChphHS/chibi-f.png"
],
images: HTMLImageElement[] = [];

for (var sp in sprites) {
	images.push(new Image());
	images[sp].src = sprites[sp];
  }