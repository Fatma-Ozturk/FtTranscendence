import { ctx, h, w } from "src/app/components/chat/chat.component";
import { drawAvatar } from "./drawAvatar";
import { drawStructure } from "./drawStructure";
import { moveAvatar } from "./moveAvatar";
import { screenText } from "./screenText";
import { images } from "./sprites";
import { worldObjs } from "./worldObjs";
import { writeScrnText } from "./writeScrnText";

export function drawScreen() {
	ctx.clearRect(0,0,w,h);

			let ground = ctx.createPattern(images[0], 'repeat'),
				pathW = 50,
				path = ctx.createLinearGradient(w/2 - pathW/2,0,w/2 + pathW/2,0);

			path.addColorStop(0.05,"#863");
			path.addColorStop(0.05,"#974");
			path.addColorStop(0.95,"#974");
			path.addColorStop(0.95,"#753");

			ctx.fillStyle = ground;
			ctx.fillRect(0,0,w,h);
			
			ctx.fillStyle = path;
			ctx.fillRect(w/2 - pathW/2,220,pathW,210);														

			// sort avatars and structures ascending by Y position so that they each arent standing on top of another
			worldObjs.sort(function(a, b){
				return a.y - b.y;
			});
			
			// render everything
			for (var wo in worldObjs) {
				// to determine if avatar, test for name
				if (worldObjs[wo].name) {
					moveAvatar(worldObjs[wo]);
					drawAvatar(worldObjs[wo]);
				} else {
					drawStructure(worldObjs[wo]);
				}
			}
			
			// screen text
			writeScrnText(screenText);
  }