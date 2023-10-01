import { Injectable } from '@angular/core';
import { ChatBarObj } from '../models/entities/chatEntities/chatBarObj';

@Injectable({
  providedIn: 'root'
})
export class TextService {

  private chatBarObj: ChatBarObj;


  constructor() { 
    this.chatBarObj = new ChatBarObj();
  }

  screenText = {
    text: "",
    color: "#fff",
    fontS: 16,
    timer: 3000,
    maxTime: 3000,
    fadeTime: 150,
    y: 0,
    h: 32,
    updateText: (txt: string, y: number, h: number, c: string) => {
      this.screenText.text = txt;
      this.screenText.timer = this.screenText.maxTime;
      this.screenText.y = y || 0;
      this.screenText.h = h || 32;
      this.screenText.color = c || "#fff";
    }
  };

  writeScrnText(txtObj: typeof this.screenText, ctx: CanvasRenderingContext2D, w: number) {
    if (txtObj.timer > 0) {
      if (!this.chatBarObj.showLog) {
        let adj = 2,
          fadeTime = txtObj.fadeTime,
          txtTimeFwd = txtObj.maxTime - txtObj.timer;
        
        // fade in
        if (txtTimeFwd < fadeTime) {
          ctx.globalAlpha = txtTimeFwd / fadeTime;
        }
        // fade out
        if (txtObj.timer < fadeTime) {
          ctx.globalAlpha = txtObj.timer / fadeTime;
        }
      
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0,txtObj.y - adj - txtObj.fontS*2,w,txtObj.h + adj);
        ctx.textAlign = "left";
        ctx.font = txtObj.fontS + "px Arial";
        ctx.fillStyle = txtObj.color;
      
        let lines = txtObj.text.split("%");
        for (let l in lines) {
          const lineIndex = parseInt(l); // Dizeyi sayıya dönüştürüyoruz
          ctx.fillText(lines[l], 5, txtObj.y - adj - (txtObj.fontS * 1.5 * -(lineIndex - 1)));
          }
        ctx.globalAlpha = 1;
      }
      
      txtObj.timer -= 1000/60;
      
      if (txtObj.timer < 0) {
        txtObj.timer = 0;
      }
    }
    }
}
