import { Injectable } from '@angular/core';
import { structureObj } from '../models/entities/chatEntities/structureObj';
import { ChatBarService } from './chat-bar.service';

@Injectable({
  providedIn: 'root'
})
export class StructuresService {

  constructor(private chatBarService: ChatBarService) { }

  images: HTMLImageElement[] = [];
  w : number = 0;
  h : number = 0;

  structures = [
    new structureObj(this.w, 50, 0, -40, 0, null, false, 1),
    new structureObj(10, this.h - this.chatBarService.barH - 10, 0, 10, 0, null, false, 1),
    new structureObj(10, this.h - this.chatBarService.barH - 10, this.w - 10, 10, 0, null, false, 1),
    new structureObj(300, 200, this.w / 2 - 150, 100, 70, this.images[1], true, 12)
    
    ];

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
