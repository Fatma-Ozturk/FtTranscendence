import { Component, OnInit } from '@angular/core';
import { chatBar } from 'src/app/models/entities/chatEntities/chatBar';
import { cmd } from 'src/app/models/entities/chatEntities/cmd';
import { control } from 'src/app/models/entities/chatEntities/control';
import { npcs } from 'src/app/models/entities/chatEntities/npcs';
import { player } from 'src/app/models/entities/chatEntities/player';
import { start } from 'src/app/models/entities/chatEntities/start';
import { stopControl } from 'src/app/models/entities/chatEntities/stopControl';

export var canvas: HTMLCanvasElement;
export var ctx: CanvasRenderingContext2D;
export var w: number;
export var h: number;
export var s: number;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

 ngOnInit(): void {
    this.app();
  }

  app() {
    canvas = document.getElementsByTagName("canvas")[0];
    ctx = canvas.getContext("2d");
    w = 568;
    h = 480;
    s = 2;

    		// set canvas dimensions with scale
		canvas.width = w * s;
		canvas.height = h * s;
		canvas.style.width = w + "px";
		canvas.style.height = h + "px";
		ctx.scale(s, s);

  
    start();

      // player moving
      document.addEventListener("keydown", (e) => {
        let field = document.querySelector("input") as HTMLInputElement,
            send = document.querySelector(".send") as HTMLButtonElement,
            viewChat = document.querySelector(".view-chat") as HTMLButtonElement;
      
        // Send button availability
        setTimeout(() => {
          send.disabled = field.value.length > 0 ? false : true;
        }, 10);
      
        // move only if not using chat
        if (!chatBar.active) {
          control(player, e);
        } else if (chatBar.history.length > 0) {
          if (e.keyCode == 38 && chatBar.curHistoryItem != chatBar.history.length - 1) {
            ++chatBar.curHistoryItem;
            field.value = chatBar.history[chatBar.history.length - chatBar.curHistoryItem - 1];
            e.preventDefault();
            field.setSelectionRange(field.value.length, field.value.length);
          } else if (e.keyCode == 40 && chatBar.curHistoryItem > -1) {
            --chatBar.curHistoryItem;
            field.value = chatBar.curHistoryItem == -1 ? "" : chatBar.history[chatBar.history.length - chatBar.curHistoryItem - 1];
          }
        }
      
        let spaces = 0;
        for (let char of field.value) {
          if (char === " ") {
            ++spaces;
          }
        }
        
        chatBar.autoCmpltLvl = spaces;
      
        if (e.keyCode == 9 && field.value[0] == "/" && chatBar.active) {
          e.preventDefault();
          let chatLog = document.querySelector(".chat-log"),
              availOpts = document.createElement("span"),
              entityResults = [player.name],
              displayEntResults = "";
      
              for (let er in npcs) {
                let index = +er + 1;
                entityResults[index] = npcs[index - 1].name;
              }
              
      
          entityResults.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
      
          for (let der in entityResults) {
            //der = +der;
            displayEntResults += (parseInt(der) > 0 ? ", " : "") + entityResults[der];
          }
      
          if (chatBar.autoCmpltLvl === 0) {
            let curString = field.value.substr(1, field.value.length - 1);
            let foundCmdMatch = false;
      
            for (let fm in cmd) {
              if (cmd[fm].name.indexOf(curString) === 0 && curString.length >= 1 && curString != cmd[fm].name) {
                chatBar.curAutoCmpltCmd = +fm;
                foundCmdMatch = true;
                field.value = "/" + cmd[chatBar.curAutoCmpltCmd].name;
              }
            }
      
            if (!foundCmdMatch && field.value.length > 0 && (cmd.find(c => c.name == curString) || field.value == "/")) {
              if (chatBar.curAutoCmpltCmd == -1) {
                let getCmds = "";
                for (let ac in cmd) {
                  getCmds += (parseInt(ac) > 0 ? ", " : "") + "/" + cmd[ac].name;
                }
                availOpts.appendChild(document.createTextNode(getCmds));
                chatLog.insertBefore(availOpts, chatLog.childNodes[0]);
              }
      
              ++chatBar.curAutoCmpltCmd;
      
              if (chatBar.curAutoCmpltCmd > cmd.length - 1) {
                chatBar.curAutoCmpltCmd = 0;
              }
      
              field.value = "/" + cmd[chatBar.curAutoCmpltCmd].name;
            }
          } else if (chatBar.autoCmpltLvl == 1) {
            let curCmd = field.value.split(" ")[0].substring(1);
            let cmdInHand = cmd.find(c => c.name === curCmd) || null;
            let reqArgs = (cmdInHand.args.match(/</g) || []).length;
      
            if (curCmd !== null && reqArgs >= 1) {
              let arg1Result = "";
              if (cmdInHand.args.indexOf("name") == 1) {
      
                if (chatBar.arg1pg == -1) {
                  availOpts.appendChild(document.createTextNode(displayEntResults));
                  chatLog.insertBefore(availOpts, chatLog.childNodes[0]);
                }
      
                ++chatBar.arg1pg;
      
                if (chatBar.arg1pg > entityResults.length - 1) {
                  chatBar.arg1pg = 0;
                }
      
                arg1Result = entityResults[chatBar.arg1pg];
      
              } else if (cmdInHand.args.indexOf("add") == 1 || cmdInHand.args.indexOf("del") == 1) {
                let opResults = ["add", "del"];
      
                if (chatBar.arg1pg == -1) {
                  availOpts.appendChild(document.createTextNode("add, del"));
                  chatLog.insertBefore(availOpts, chatLog.childNodes[0]);
                }
      
                ++chatBar.arg1pg;
      
                if (chatBar.arg1pg > opResults.length - 1) {
                  chatBar.arg1pg = 0;
                }
      
                arg1Result = opResults[chatBar.arg1pg];
              }
              field.value = "/" + cmdInHand.name + " " + arg1Result;
            }
          } else if (chatBar.autoCmpltLvl == 2) {
            let curCmd = field.value.substring(1).split(" ");
            let cmdInHand = cmd.find(c => c.name === curCmd[0]) || null;
            let curArgs = curCmd[1];
            let reqArgs = (cmdInHand.args.match(/</g) || []).length;
      
            if (curCmd[0] !== null && reqArgs >= 2) {
              if (cmdInHand.args.indexOf("name") > -1) {
      
                if (chatBar.arg2pg == -1) {
                  availOpts.appendChild(document.createTextNode(displayEntResults));
                  chatLog.insertBefore(availOpts, chatLog.childNodes[0]);
                }
      
                ++chatBar.arg2pg;
      
                if (chatBar.arg2pg > entityResults.length - 1) {
                  chatBar.arg2pg = 0;
                }
      
                field.value = "/" + cmdInHand.name + " " + curCmd[1] + " " + entityResults[chatBar.arg2pg];
              }
            }
          }
        } else {
          chatBar.curAutoCmpltCmd = -1;
          chatBar.arg1pg = -1;
          chatBar.arg2pg = -1;
        }
      
        if (e.keyCode == 86 && !chatBar.active) {
          e.preventDefault();
          chatBar.logToggle();
        } else if (e.keyCode == 191 && !chatBar.active) {
          field.value = "";
          chatBar.logToggle();
        } else if (e.keyCode == 27) {
          chatBar.active = false;
          chatBar.logHide();
          field.blur();
          send.blur();
          viewChat.blur();
        }
      });
      
      
    // player stop moving
    document.addEventListener("keyup", function () {
    stopControl(player);
    });
    // player send chat messages
    document.querySelector("input")?.addEventListener("focus", function () {
    chatBar.active = true;
    });
    document.querySelector("input")?.addEventListener("blur", function () {
    chatBar.active = false;
    });
    document.querySelector(".send")?.addEventListener("click", function (e) {
    e.preventDefault();
    let field = document.querySelector("input");
    if (field.value.length > 0) {
      player.sendMsg(field.value);
      chatBar.history.push(field.value);
      chatBar.curHistoryItem = -1;
      if (!chatBar.showLog) {
        chatBar.active = false;
        field.blur();
      }
    }
      field.value = "";
    });
    // show/hide chat using button
    document.querySelector(".view-chat")?.addEventListener("click", function (e) {
    e.preventDefault();
    chatBar.logToggle();
    });

    canvas?.addEventListener("click", function () {
			chatBar.logHide();
		  });
  }
}