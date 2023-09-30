import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { randNum } from 'src/app/models/entities/chatEntities/randNum';
import { findCllsn } from 'src/app/models/entities/chatEntities/findCllsn';
import { AvatarService } from 'src/app/services/avatar.service';
import { StructuresService } from 'src/app/services/structures.service';
import { avatarObj } from 'src/app/models/entities/chatEntities/avatarObj';
import { TextService } from 'src/app/services/text.service';
import { ChatBarService } from 'src/app/services/chat-bar.service';
import { CmdService } from 'src/app/services/cmd.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  constructor(private avatarService: AvatarService,
    private structuresService: StructuresService,
    private textService: TextService,
    private chatBarService: ChatBarService,
    private cmdService: CmdService) {

  }


ngOnInit(): void {
    var canvas = document.getElementsByTagName("canvas")[0];
    var ctx = canvas.getContext("2d");
    //canvas: ElementRef<HTMLCanvasElement>;
    //ctx: CanvasRenderingContext2D;
    var w = 800;
    var h = 600;
    var s = 2;

    canvas.width = w * s;
    canvas.height = h * s;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.scale(s, s);

    var sprites = [
      "https://i.ibb.co/TqMC0Dp/grass.png",
      "https://i.ibb.co/GTsDmJF/fountain.png",
      "https://i.ibb.co/59SRcxm/chibi-m.png",
      "https://i.ibb.co/PChphHS/chibi-f.png"
    ];

    var images: HTMLImageElement[] = [];

    for (var sprite of sprites) {
      var img = new Image();
      img.src = sprite;
      images.push(img);
    }


    const npcs: any[] = [];
    const worldObjs: any[] = [];
 
    this.chatBarService.canvas = canvas;
    this.chatBarService.s = s;
    this.structuresService.images = images;
    this.structuresService.w = w;
    this.structuresService.h = h;

    
    var player = new avatarObj("Fatma", 0, 0, 30, 60, 3, 28, 2, w / 2 - 15, h * 0.8 - this.chatBarService.barH, 0, this.chatBarService, this.cmdService, this.textService);
    
    this.createNPCs(player, w, h, npcs);
    worldObjs[0] = player;

    for (var sn in npcs) {
      const numericSn = +sn + 1;
      worldObjs[numericSn] = npcs[numericSn - 1];
    }

    // load structures
    let avatars = worldObjs.length;
    for (var ss in this.structuresService.structures) {
      var numericSs = +ss + avatars;
      worldObjs[numericSs] = this.structuresService.structures[numericSs - avatars];
    }

    // onboarding
    let onboardingTxt = "Welcome! To get started, enter /help for commands.",
      chatLog = document.querySelector(".chat-log"),
      newEntry = document.createElement("span");

    newEntry.className = "info-text";
    newEntry.appendChild(document.createTextNode(onboardingTxt));
    chatLog.insertBefore(newEntry, chatLog.childNodes[0]);
    this.textService.screenText.updateText(onboardingTxt, h - this.chatBarService.barH, this.textService.screenText.fontS * 2, "#ff4");

    this.runAI(player, npcs, worldObjs, h, canvas);

    this.runDisplay(w, h, worldObjs, images, ctx, player);

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
      if (!this.chatBarService.active) {
        this.avatarService.control(player, e);
      } else if (this.chatBarService.history.length > 0) {
        if (e.keyCode == 38 && this.chatBarService.curHistoryItem != this.chatBarService.history.length - 1) {
          ++this.chatBarService.curHistoryItem;
          field.value = this.chatBarService.history[this.chatBarService.history.length - this.chatBarService.curHistoryItem - 1];
          e.preventDefault();
          field.setSelectionRange(field.value.length, field.value.length);
        } else if (e.keyCode == 40 && this.chatBarService.curHistoryItem > -1) {
          --this.chatBarService.curHistoryItem;
          field.value = this.chatBarService.curHistoryItem == -1 ? "" : this.chatBarService.history[this.chatBarService.history.length - this.chatBarService.curHistoryItem - 1];
        }
      }
    
      let spaces = 0;
      for (let char of field.value) {
        if (char === " ") {
          ++spaces;
        }
      }
      
      this.chatBarService.autoCmpltLvl = spaces;
    
      if (e.keyCode == 9 && field.value[0] == "/" && this.chatBarService.active) {
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
    
        if (this.chatBarService.autoCmpltLvl === 0) {
          let curString = field.value.substr(1, field.value.length - 1);
          let foundCmdMatch = false;
    
          for (let fm in this.cmdService.cmd) {
            if (this.cmdService.cmd[fm].name.indexOf(curString) === 0 && curString.length >= 1 && curString != this.cmdService.cmd[fm].name) {
              this.chatBarService.curAutoCmpltCmd = +fm;
              foundCmdMatch = true;
              field.value = "/" + this.cmdService.cmd[this.chatBarService.curAutoCmpltCmd].name;
            }
          }
    
          if (!foundCmdMatch && field.value.length > 0 && (this.cmdService.cmd.find(c => c.name == curString) || field.value == "/")) {
            if (this.chatBarService.curAutoCmpltCmd == -1) {
              let getCmds = "";
              for (let ac in this.cmdService.cmd) {
                getCmds += (parseInt(ac) > 0 ? ", " : "") + "/" + this.cmdService.cmd[ac].name;
              }
              availOpts.appendChild(document.createTextNode(getCmds));
              chatLog.insertBefore(availOpts, chatLog.childNodes[0]);
            }
    
            ++this.chatBarService.curAutoCmpltCmd;
    
            if (this.chatBarService.curAutoCmpltCmd > this.cmdService.cmd.length - 1) {
              this.chatBarService.curAutoCmpltCmd = 0;
            }
    
            field.value = "/" + this.cmdService.cmd[this.chatBarService.curAutoCmpltCmd].name;
          }
        } else if (this.chatBarService.autoCmpltLvl == 1) {
          let curCmd = field.value.split(" ")[0].substring(1);
          let cmdInHand = this.cmdService.cmd.find(c => c.name === curCmd) || null;
          let reqArgs = (cmdInHand.args.match(/</g) || []).length;
    
          if (curCmd !== null && reqArgs >= 1) {
            let arg1Result = "";
            if (cmdInHand.args.indexOf("name") == 1) {
    
              if (this.chatBarService.arg1pg == -1) {
                availOpts.appendChild(document.createTextNode(displayEntResults));
                chatLog.insertBefore(availOpts, chatLog.childNodes[0]);
              }
    
              ++this.chatBarService.arg1pg;
    
              if (this.chatBarService.arg1pg > entityResults.length - 1) {
                this.chatBarService.arg1pg = 0;
              }
    
              arg1Result = entityResults[this.chatBarService.arg1pg];
    
            } else if (cmdInHand.args.indexOf("add") == 1 || cmdInHand.args.indexOf("del") == 1) {
              let opResults = ["add", "del"];
    
              if (this.chatBarService.arg1pg == -1) {
                availOpts.appendChild(document.createTextNode("add, del"));
                chatLog.insertBefore(availOpts, chatLog.childNodes[0]);
              }
    
              ++this.chatBarService.arg1pg;
    
              if (this.chatBarService.arg1pg > opResults.length - 1) {
                this.chatBarService.arg1pg = 0;
              }
    
              arg1Result = opResults[this.chatBarService.arg1pg];
            }
            field.value = "/" + cmdInHand.name + " " + arg1Result;
          }
        } else if (this.chatBarService.autoCmpltLvl == 2) {
          let curCmd = field.value.substring(1).split(" ");
          let cmdInHand = this.cmdService.cmd.find(c => c.name === curCmd[0]) || null;
          let curArgs = curCmd[1];
          let reqArgs = (cmdInHand.args.match(/</g) || []).length;
    
          if (curCmd[0] !== null && reqArgs >= 2) {
            if (cmdInHand.args.indexOf("name") > -1) {
    
              if (this.chatBarService.arg2pg == -1) {
                availOpts.appendChild(document.createTextNode(displayEntResults));
                chatLog.insertBefore(availOpts, chatLog.childNodes[0]);
              }
    
              ++this.chatBarService.arg2pg;
    
              if (this.chatBarService.arg2pg > entityResults.length - 1) {
                this.chatBarService.arg2pg = 0;
              }
    
              field.value = "/" + cmdInHand.name + " " + curCmd[1] + " " + entityResults[this.chatBarService.arg2pg];
            }
          }
        }
      } else {
        this.chatBarService.curAutoCmpltCmd = -1;
        this.chatBarService.arg1pg = -1;
        this.chatBarService.arg2pg = -1;
      }
    
      if (e.keyCode == 86 && !this.chatBarService.active) {
        e.preventDefault();
        this.chatBarService.logToggle();
      } else if (e.keyCode == 191 && !this.chatBarService.active) {
        field.value = "";
        this.chatBarService.logToggle();
      } else if (e.keyCode == 27) {
        this.chatBarService.active = false;
        this.chatBarService.logHide();
        field.blur();
        send.blur();
        viewChat.blur();
      }
    });
    
    
  // player stop moving
  document.addEventListener("keyup", () => {
  this.avatarService.stopControl(player);
  });
  // player send chat messages
  document.querySelector("input")?.addEventListener("focus", () => {
    this.chatBarService.active = true;
  });
  document.querySelector("input")?.addEventListener("blur", () => {
    this.chatBarService.active = false;
  });
  document.querySelector(".send")?.addEventListener("click", (e) => {
  e.preventDefault();
  let field = document.querySelector("input");
  if (field.value.length > 0) {
    player.sendMsg(field.value, npcs, worldObjs, canvas);
    this.chatBarService.history.push(field.value);
    this.chatBarService.curHistoryItem = -1;
    if (!this.chatBarService.showLog) {
      this.chatBarService.active = false;
      field.blur();
    }
  }
    field.value = "";
  });
  // show/hide chat using button
  document.querySelector(".view-chat")?.addEventListener("click", (e) => {
  e.preventDefault();
  this.chatBarService.logToggle();
  });

  canvas?.addEventListener("click", () => {
    this.chatBarService.logHide();
    });


 }

  createNPCs(player: avatarObj, w: number, h: number, npcs: any[]) {
    const NameObj = (name: string, gender: string) => ({
      name: name,
      gender: gender
    }),

      npcNames = [
        NameObj("Alice", "female"),
        NameObj("Jack", "male"),
        NameObj("Jill", "female")
      ],


      avatarW = 30,
      avatarH = 60;

    for (const npcn in npcNames) {
      let chooseSkin = randNum(0, 3),
        placeX = randNum(0, w - avatarW),
        placeY = randNum(avatarH, h - this.chatBarService.barH - avatarH);

      npcs[npcn] = new avatarObj(
        npcNames[npcn].name,
        npcNames[npcn].gender,
        chooseSkin,
        avatarW,
        avatarH,
        3,
        28,
        2,
        placeX,
        placeY,
        8,
        this.chatBarService,
        this.cmdService,
        this.textService
      );

      if (findCllsn(npcs[npcn], this.structuresService.structures)) {
        npcs[npcn].x = player.x;
        npcs[npcn].y = player.y;
      }
    }
  }

  runAI(player: avatarObj, npcs: any[], worldObjs: any[], h: number, canvas: HTMLCanvasElement) {
    for (var ai in npcs) {
      this.avatarService.npcAI(npcs[ai], player, npcs, worldObjs, h, canvas);
    }
    setTimeout(this.runAI, 400);
  }

  runDisplay = (w: number, h: number, worldObjs: any[], images: HTMLImageElement[], ctx: CanvasRenderingContext2D, player: avatarObj) =>  {
    //this.drawScreen(w, h, worldObjs, images, ctx, player);
    ctx.clearRect(0, 0, w, h);

    let ground = ctx.createPattern(images[0], 'repeat'),
      pathW = 50,
      path = ctx.createLinearGradient(w / 2 - pathW / 2, 0, w / 2 + pathW / 2, 0);

    path.addColorStop(0.05, "#863");
    path.addColorStop(0.05, "#974");
    path.addColorStop(0.95, "#974");
    path.addColorStop(0.95, "#753");

    ctx.fillStyle = ground;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = path;
    ctx.fillRect(w / 2 - pathW / 2, 220, pathW, 210);

    // sort avatars and structures ascending by Y position so that they each arent standing on top of another
    worldObjs.sort(function (a, b) {
      return a.y - b.y;
    });

    // render everything
    for (var wo in worldObjs) {
      // to determine if avatar, test for name
      if (worldObjs[wo].name) {
        this.avatarService.moveAvatar(worldObjs[wo], player, w, h);
        this.avatarService.drawAvatar(worldObjs[wo], player, ctx, images);
      } else {
        this.structuresService.drawStructure(worldObjs[wo], ctx);
      }
    }

    // screen text
    this.textService.writeScrnText(this.textService.screenText, ctx, w);
    setTimeout(() => {
      this.runDisplay(w, h, worldObjs, images, ctx, player);
    }, 1000 / 60);
  }

}