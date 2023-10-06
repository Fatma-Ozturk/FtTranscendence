import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { randNum } from 'src/app/models/entities/chatEntities/randNum';
import { findCllsn } from 'src/app/models/entities/chatEntities/findCllsn';
import { AvatarService } from 'src/app/services/avatar.service';
import { StructuresService } from 'src/app/services/structures.service';
import { avatarObj } from 'src/app/models/entities/chatEntities/avatarObj';
import { CmdService } from 'src/app/services/cmd.service';
import { TextService } from 'src/app/services/text.service';
import { ChatBarObj } from 'src/app/models/entities/chatEntities/chatBarObj';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {

  private chatBarObj: ChatBarObj;
  isArrowUpPressed: boolean = false;
  isArrowDownPressed: boolean = false;


  @ViewChild('myCanvas')
  canvas: ElementRef<HTMLCanvasElement>;
  context: CanvasRenderingContext2D;
  w: number;
  h: number;
  s: number;

  
  constructor(private avatarService: AvatarService,
    private structuresService: StructuresService,
    //private textService: TextService,
    private cmdService: CmdService,
    private renderer: Renderer2, private el: ElementRef) {
      this.chatBarObj = new ChatBarObj();
    }
    
    player = new avatarObj("Fatma", 1, 0, 30, 60, 3, 28, 2, 568 / 2 - 15, 480 * 0.8 - 54, 0);


  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

    this.context = this.canvas.nativeElement.getContext('2d');
    this.w = 568;
    this.h = 480;
    this.s = 2;
 
    const npcs: any[] = [];
    const worldObjs: any[] = [];

    this.createNPCs(this.player, npcs);
    worldObjs[0] = this.player;

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

    //this.addOnboardingText();

    this.runAI(this.player, npcs, worldObjs);

    this.runDisplay(worldObjs, this.player);



    /*     // player moving
        document.addEventListener("keydown", (e) => {
         let field = document.querySelector("input") as HTMLInputElement,
             send = document.querySelector(".send") as HTMLButtonElement,
             viewChat = document.querySelector(".view-chat") as HTMLButtonElement;
       
         // Send button availability
         setTimeout(() => {
           send.disabled = field.value.length > 0 ? false : true;
         }, 10);
       
         // move only if not using chat
         if (!this.chatBarObj.active) {
           this.avatarService.control(player, e);
         } else if (this.chatBarObj.history.length > 0) {
           if (e.keyCode == 38 && this.chatBarObj.curHistoryItem != this.chatBarObj.history.length - 1) {
             ++this.chatBarObj.curHistoryItem;
             field.value = this.chatBarObj.history[this.chatBarObj.history.length - this.chatBarObj.curHistoryItem - 1];
             e.preventDefault();
             field.setSelectionRange(field.value.length, field.value.length);
           } else if (e.keyCode == 40 && this.chatBarObj.curHistoryItem > -1) {
             --this.chatBarObj.curHistoryItem;
             field.value = this.chatBarObj.curHistoryItem == -1 ? "" : this.chatBarObj.history[this.chatBarObj.history.length - this.chatBarObj.curHistoryItem - 1];
           }
         }
       
         let spaces = 0;
         for (let char of field.value) {
           if (char === " ") {
             ++spaces;
           }
         }
         
         this.chatBarObj.autoCmpltLvl = spaces;
       
         if (e.keyCode == 9 && field.value[0] == "/" && this.chatBarObj.active) {
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
       
           if (this.chatBarObj.autoCmpltLvl === 0) {
             let curString = field.value.substr(1, field.value.length - 1);
             let foundCmdMatch = false;
       
             for (let fm in this.cmdService.cmd) {
               if (this.cmdService.cmd[fm].name.indexOf(curString) === 0 && curString.length >= 1 && curString != this.cmdService.cmd[fm].name) {
                 this.chatBarObj.curAutoCmpltCmd = +fm;
                 foundCmdMatch = true;
                 field.value = "/" + this.cmdService.cmd[this.chatBarObj.curAutoCmpltCmd].name;
               }
             }
       
             if (!foundCmdMatch && field.value.length > 0 && (this.cmdService.cmd.find(c => c.name == curString) || field.value == "/")) {
               if (this.chatBarObj.curAutoCmpltCmd == -1) {
                 let getCmds = "";
                 for (let ac in this.cmdService.cmd) {
                   getCmds += (parseInt(ac) > 0 ? ", " : "") + "/" + this.cmdService.cmd[ac].name;
                 }
                 availOpts.appendChild(document.createTextNode(getCmds));
                 chatLog.insertBefore(availOpts, chatLog.childNodes[0]);
               }
       
               ++this.chatBarObj.curAutoCmpltCmd;
       
               if (this.chatBarObj.curAutoCmpltCmd > this.cmdService.cmd.length - 1) {
                 this.chatBarObj.curAutoCmpltCmd = 0;
               }
       
               field.value = "/" + this.cmdService.cmd[this.chatBarObj.curAutoCmpltCmd].name;
             }
           } else if (this.chatBarObj.autoCmpltLvl == 1) {
             let curCmd = field.value.split(" ")[0].substring(1);
             let cmdInHand = this.cmdService.cmd.find(c => c.name === curCmd) || null;
             let reqArgs = (cmdInHand.args.match(/</g) || []).length;
       
             if (curCmd !== null && reqArgs >= 1) {
               let arg1Result = "";
               if (cmdInHand.args.indexOf("name") == 1) {
       
                 if (this.chatBarObj.arg1pg == -1) {
                   availOpts.appendChild(document.createTextNode(displayEntResults));
                   chatLog.insertBefore(availOpts, chatLog.childNodes[0]);
                 }
       
                 ++this.chatBarObj.arg1pg;
       
                 if (this.chatBarObj.arg1pg > entityResults.length - 1) {
                   this.chatBarObj.arg1pg = 0;
                 }
       
                 arg1Result = entityResults[this.chatBarObj.arg1pg];
       
               } else if (cmdInHand.args.indexOf("add") == 1 || cmdInHand.args.indexOf("del") == 1) {
                 let opResults = ["add", "del"];
       
                 if (this.chatBarObj.arg1pg == -1) {
                   availOpts.appendChild(document.createTextNode("add, del"));
                   chatLog.insertBefore(availOpts, chatLog.childNodes[0]);
                 }
       
                 ++this.chatBarObj.arg1pg;
       
                 if (this.chatBarObj.arg1pg > opResults.length - 1) {
                   this.chatBarObj.arg1pg = 0;
                 }
       
                 arg1Result = opResults[this.chatBarObj.arg1pg];
               }
               field.value = "/" + cmdInHand.name + " " + arg1Result;
             }
           } else if (this.chatBarObj.autoCmpltLvl == 2) {
             let curCmd = field.value.substring(1).split(" ");
             let cmdInHand = this.cmdService.cmd.find(c => c.name === curCmd[0]) || null;
             let curArgs = curCmd[1];
             let reqArgs = (cmdInHand.args.match(/</g) || []).length;
       
             if (curCmd[0] !== null && reqArgs >= 2) {
               if (cmdInHand.args.indexOf("name") > -1) {
       
                 if (this.chatBarObj.arg2pg == -1) {
                   availOpts.appendChild(document.createTextNode(displayEntResults));
                   chatLog.insertBefore(availOpts, chatLog.childNodes[0]);
                 }
       
                 ++this.chatBarObj.arg2pg;
       
                 if (this.chatBarObj.arg2pg > entityResults.length - 1) {
                   this.chatBarObj.arg2pg = 0;
                 }
       
                 field.value = "/" + cmdInHand.name + " " + curCmd[1] + " " + entityResults[this.chatBarObj.arg2pg];
               }
             }
           }
         } else {
           this.chatBarObj.curAutoCmpltCmd = -1;
           this.chatBarObj.arg1pg = -1;
           this.chatBarObj.arg2pg = -1;
         }
       
         if (e.keyCode == 86 && !this.chatBarObj.active) {
           e.preventDefault();
           this.chatBarObj.logToggle();
         } else if (e.keyCode == 191 && !this.chatBarObj.active) {
           field.value = "";
           this.chatBarObj.logToggle();
         } else if (e.keyCode == 27) {
           this.chatBarObj.active = false;
           this.chatBarObj.logHide();
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
       this.chatBarObj.active = true;
     });
     document.querySelector("input")?.addEventListener("blur", () => {
       this.chatBarObj.active = false;
     });
     document.querySelector(".send")?.addEventListener("click", (e) => {
     e.preventDefault();
     let field = document.querySelector("input");
     if (field.value.length > 0) {
       player.sendMsg(field.value, npcs, worldObjs, this.canvas.nativeElement);
       this.chatBarObj.history.push(field.value);
       this.chatBarObj.curHistoryItem = -1;
       if (!this.chatBarObj.showLog) {
         this.chatBarObj.active = false;
         field.blur();
       }
     }
       field.value = "";
     });
     // show/hide chat using button
     document.querySelector(".view-chat")?.addEventListener("click", (e) => {
     e.preventDefault();
     this.chatBarObj.logToggle();
     });
   
     this.canvas?.nativeElement.addEventListener("click", () => {
       this.chatBarObj.logHide();
       }); */

  }

/*   addOnboardingText() {

    const onboardingTxt = 'Welcome! To get started, enter /help for commands.';
    const chatLog = this.el.nativeElement.querySelector('.chat-log');
    const newEntry = this.renderer.createElement('span');

    this.renderer.addClass(newEntry, 'info-text');
    this.renderer.appendChild(newEntry, this.renderer.createText(onboardingTxt));
    this.renderer.insertBefore(chatLog, newEntry, chatLog.childNodes[0]);
    this.textService.screenText.updateText(onboardingTxt, this.h - this.chatBarObj.barH, this.textService.screenText.fontS * 2, "#ff4");
  } */

  createNPCs(player: avatarObj, npcs: any[]) {
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
        placeX = randNum(0, this.w - avatarW),
        placeY = randNum(avatarH, this.h - this.chatBarObj.barH - avatarH);

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
        8
      );

      if (findCllsn(npcs[npcn], this.structuresService.structures)) {
        npcs[npcn].x = player.x;
        npcs[npcn].y = player.y;
      }
    }
  }

  runAI(player: avatarObj, npcs: any[], worldObjs: any[]) {
    for (var ai in npcs) {
      this.avatarService.npcAI(npcs[ai], player, npcs, worldObjs, this.h, this.canvas.nativeElement);
    }
    setTimeout(this.runAI, 400);
  }

  runDisplay = (worldObjs: any[], player: avatarObj) => {

    this.context.clearRect(0, 0, this.w, this.h);

    var imgG: HTMLImageElement = new Image();
    imgG.src = "https://i.ibb.co/TqMC0Dp/grass.png";

    let ground = this.context.createPattern(imgG, 'repeat');
    let   pathW = 50,
      path = this.context.createLinearGradient(this.w / 2 - pathW / 2, 0, this.w / 2 + pathW / 2, 0);

    path.addColorStop(0.05, "#863");
    path.addColorStop(0.05, "#974");
    path.addColorStop(0.95, "#974");
    path.addColorStop(0.95, "#753");

    this.context.fillStyle = ground;
    this.context.fillRect(0, 0, this.w, this.h);

    this.context.fillStyle = path;
    this.context.fillRect(this.w / 2 - pathW / 2, 220, pathW, 260);

    // sort avatars and structures ascending by Y position so that they each arent standing on top of another
    worldObjs.sort(function (a, b) {
      return a.y - b.y;
    });

    // render everything
    for (var wo in worldObjs) {
      // to determine if avatar, test for name
      if (worldObjs[wo].name) {
        this.avatarService.moveAvatar(worldObjs[wo], player, this.w, this.h);
        this.avatarService.drawAvatar(worldObjs[wo], player, this.context);
      } else {
        this.structuresService.drawStructure(worldObjs[wo], this.context);
      }
    }

    // screen text
    //this.textService.writeScrnText(this.textService.screenText, this.context, this.w);
    setTimeout(() => {
      this.runDisplay(worldObjs, player);
    }, 1000 / 60);
  }


  @HostListener('window:keydown', ['$event'])
  onkeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      this.isArrowUpPressed = true;
      console.log("arrow up");
    } else if (event.key === 'ArrowDown') {
      this.isArrowDownPressed = true;
      console.log("arrow down");
    }
    this.avatarService.control(this.player, event); 
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      this.isArrowUpPressed = false;
    } else if (event.key === 'ArrowDown') {
      this.isArrowDownPressed = false;
    }
    this.avatarService.stopControl(this.player);
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('send')) {
      event.preventDefault();
      const field = this.el.nativeElement.querySelector('input');
      this.player.sendMsg(field.value);
    }
  }

}