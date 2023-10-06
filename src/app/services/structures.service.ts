import { Injectable } from '@angular/core';
import { structureObj } from '../models/entities/chatEntities/structureObj';

@Injectable({
  providedIn: 'root'
})
export class StructuresService {

  constructor() {
    this.img = new Image();
    this.img.src = "https://i.ibb.co/GTsDmJF/fountain.png";
    this.structures = [
      //new structureObj(this.w, 50, 0, -40, 0, null, false, 1),
      //new structureObj(10, this.h - this.chatBarObj.barH - 10, 0, 10, 0, null, false, 1),
      //new structureObj(10, this.h - this.chatBarObj.barH - 10, this.w - 10, 10, 0, null, false, 1),
      //new structureObj(300, 200, this.w / 2 - 100, 100, 70, this.img, true, 12)
      new structureObj(300, 200, 130, 100, 70, this.img, true, 12)
      ];
  }

  img: HTMLImageElement;
  structures: structureObj[] = [];


     drawStructure(strctr: structureObj, ctx: CanvasRenderingContext2D) {
      if (strctr.img === null) {
        ctx.fillStyle = "#aaa";
        ctx.fillRect(strctr.x,strctr.y,strctr.w,strctr.h);
      } else if (strctr.isAnim) {
        
        ctx.drawImage(strctr.img,strctr.w*(strctr.curFrame - 1),0,strctr.w,strctr.h,strctr.x,strctr.y-strctr.backArea,strctr.w,strctr.h);
        ++strctr.curFrame;
        if (strctr.curFrame > strctr.frames) {
          strctr.curFrame = 1;
        }
      } else {
        ctx.drawImage(strctr.img,strctr.x,strctr.y,strctr.w,strctr.h);
      }
      }
}
