import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatBarService {

  constructor() { }

  canvas: HTMLCanvasElement | null = null;
  s: number;

    barH: number = 54;
    logH: number = 220;
    margin: number = 5;
    active: boolean =  false;
    showLog: boolean = false;
    maxLines: number = 32;
    history: any = [];
    curHistoryItem: number = -1;
    curAutoCmpltCmd: number =  -1;
    arg1pg: number = -1;
    arg2pg: number = -1;
    autoCmpltLvl:number =  0;

    logShow (){
      try {
        let log = document.querySelector(".chat-log") as HTMLDivElement,
          field = document.querySelector("input");
          
        log.style.display = "flex";
        this.active = true;
        this.showLog = true;
        field.focus();
      }
      catch(err) {
        console.log("Chatbar must be created first in order to show the log");
      }
    };

    logHide() {
      try {
        let log = document.querySelector(".chat-log") as HTMLDivElement,
          field = document.querySelector("input");
          
       log.style.display = "none";
        this.active = false;
        this.showLog = false;
        field.blur();
      }
      catch(err) {
        console.log("Chatbar must be created first in order to hide the log");
      }
    };

    logToggle() {
      if (this.showLog) {
        this.logHide();
      } else {
        this.logShow();
      }
    };

    create() {
      let form = document.createElement("form"),
        field = document.createElement("input"),
        btn1 = document.createElement("button"),
        btn2 = document.createElement("button"),
        log = document.createElement("div");

      // set up form elements and translate them to inside canvas
      form.action = "";
      form.style.padding = this.margin + "px";
      form.style.width = (this.canvas.width / this.s) + "px";
      form.style.height = (this.barH) + "px";
      form.style.transform = "translateY(" + (-this.barH) + "px)";
      // text input
      field.type = "text";
      field.style.fontSize = (this.barH*0.4) + "px";
      field.style.height = (this.barH - this.margin*2) + "px";
      field.style.padding = "0 " + this.margin + "px";
      field.maxLength = 64;
      // send button
      btn1.className = "send";
      btn1.style.fontSize = (this.barH*0.4) + "px";
      btn1.style.height = (this.barH - this.margin*2) + "px";
      //btn1.disabled = "disabled";
      // view chat button
      btn2.className = "view-chat";
      btn2.style.fontSize = (this.barH*0.25) + "px";
      btn2.style.height = (this.barH - this.margin*2) + "px";
      
      // chat log																						
      log.className = "chat-log";
      log.style.width = (this.canvas.width / this.s) + "px";
      log.style.height = (this.logH) + "px";
      log.style.transform = "translateY(" + (-this.barH*2 - this.logH) + "px)";
      log.style.padding = this.margin + "px";

      document.body.appendChild(form);
      document.body.appendChild(log);
      form.appendChild(field);
      form.appendChild(btn1);
      form.appendChild(btn2);
      btn1.appendChild(document.createTextNode("Send"));
      btn2.appendChild(document.createTextNode("View Chat"));
    }

}
