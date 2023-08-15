import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, HostListener } from '@angular/core';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
 /*  screenHeight: number;
  screenWidth: number; */

  /* @ViewChild('gameCanvas', { static: true }) canvasRef: ElementRef<HTMLCanvasElement>;
  context: CanvasRenderingContext2D;

  isArrowUpPressed: boolean = false;
  isArrowDownPressed: boolean = false;

  sprites = [
    "https://i.ibb.co/TqMC0Dp/grass.png",
    "https://i.ibb.co/GTsDmJF/fountain.png",
    "https://i.ibb.co/59SRcxm/chibi-m.png",
    "https://i.ibb.co/PChphHS/chibi-f.png"
  ];
  chatHistoryList: HTMLUListElement | undefined;
  messageToSendText: string = '';

  constructor() { }

  ngOnInit(): void {
    // Initialization that doesn't rely on view elements can be placed here.
  }

  ngAfterViewInit(): void {
    // The view elements are now available, so we can safely access them.
    this.cacheDOM();
  }

  cacheDOM(): void {
    if (this.chatHistory && this.chatHistory.nativeElement && this.chatHistory.nativeElement.querySelector) {
      this.chatHistoryList = this.chatHistory.nativeElement.querySelector('ul');
    }
  }
  

  render(): void {
    this.scrollToBottom();
    if (this.messageToSendText.trim() !== '') {
      const template = `
        <li class="message new">
          <figure class="avatar">
            <img src="assets/user.svg" />
          </figure>
          <div class="message-text">${this.messageToSendText}</div>
          <div class="timestamp">${this.getCurrentTime()}</div>
        </li>
      `;
      this.chatHistoryList?.insertAdjacentHTML('beforeend', template);
      this.scrollToBottom();

      // responses
      const response = this.getRandomItem(this.messageResponses);
      const templateResponse = `
        <li class="message message-personal">
          <figure class="avatar">
            <img src="assets/bot.svg" />
          </figure>
          <div class="message-text">${response}</div>
          <div class="timestamp">${this.getCurrentTime()}</div>
        </li>
      `;
      setTimeout(() => {
        this.chatHistoryList?.insertAdjacentHTML('beforeend', templateResponse);
        this.scrollToBottom();
      }, 1500);

      this.messageToSendText = '';
    }
  }

  addMessage(): void {
    this.messageToSendText = this.messageToSend.nativeElement.value;
    this.render();
  }

  addMessageEnter(event: KeyboardEvent): void {
    if (event.keyCode === 13) {
      this.addMessage();
    }
  }

  scrollToBottom(): void {
    this.chatHistory.nativeElement.scrollTop = this.chatHistory.nativeElement.scrollHeight;
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString()
      .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
  }

  getScreenSize() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  } */

  ngOnInit(): void {
    this.app();
  }
  
  app() {
	var canvas = document.getElementsByTagName("canvas")[0],
		ctx = canvas.getContext("2d"),
		// canvas dimensions
		w = 568,
		h = 480,
		// scale, keep at 2 for best retina results
		s = 2;

	// set canvas dimensions with scale
	canvas.width = w * s;
	canvas.height = h * s;
	canvas.style.width = w + "px";
	canvas.style.height = h + "px";
	ctx.scale(s, s);

	/* Main app code */
	// all artwork done by me :)
	var sprites = [
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
	
	var chatBar = {
			barH: 54,
			logH: 220,
			margin: 5,
			active: false,
			showLog: false,
			maxLines: 32,
			history: [] as string[],
			curHistoryItem: -1,
			curAutoCmpltCmd: -1,
			arg1pg: -1,
			arg2pg: -1,
			autoCmpltLvl: 0,
			logShow: function() {
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
			},
			logHide: function() {
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
			},
			logToggle: function() {
				if (this.showLog) {
					this.logHide();
				} else {
					this.logShow();
				}
			},
			create: function() {
				let form = document.createElement("form"),
					field = document.createElement("input"),
					btn1 = document.createElement("button"),
					btn2 = document.createElement("button"),
					log = document.createElement("div");

				// set up form elements and translate them to inside canvas
				form.action = "";
				form.style.padding = this.margin + "px";
				form.style.width = (canvas.width / s) + "px";
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
				btn1.disabled = true;
				// view chat button
				btn2.className = "view-chat";
				btn2.style.fontSize = (this.barH*0.25) + "px";
				btn2.style.height = (this.barH - this.margin*2) + "px";
				
				// chat log																						
				log.className = "chat-log";
				log.style.width = (canvas.width / s) + "px";
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
		},
		screenText = {
			text: "",
			color: "#fff",
			fontS: 16,
			timer: 3000,
			maxTime: 3000,
			fadeTime: 150,
			y: 0,
			h: 32,
			updateText: function(txt: string, y: number, h: number, c: string) {
				this.text = txt;
				this.timer = this.maxTime;
				this.y = y || 0;
				this.h = h || 32;
				this.color = c || "#fff";
			}
		}

		class BubbleObj {
      text: string;
      w: number;
      x: number;
      y: number;
    
      constructor(text: string, w: number, x: number, y: number) {
        let minW = 35;
        this.text = text;
        this.w = w < minW ? minW : w;
        this.x = x;
        this.y = y;
      }
    }

	class CmdObj {
  name: string;
  args: string;
  desc: string;

  constructor(name: string, args: string = "", desc: string = "") {
    this.name = name;
    this.args = args;
    this.desc = desc;
  }
}

const cmd: CmdObj[] = [
  new CmdObj("clear", "", "clear chat"),
  new CmdObj("help", "", "get help menu"),
  new CmdObj("entityinfo", "<name>", "get details of entity"),
  new CmdObj("modentity", "<name> <newname> [gender] [skin] [speed] [level]", "modify entity"),
  new CmdObj("npc", "<add|del> <name> [gender] [skin] [speed] [level] [<x> <y>]", "add/delete NPC"),
  new CmdObj("tp", "<name> <x> <y> or <name> <targetname>", "teleport entity to new location"),
  new CmdObj("who", "", "get list of all entities")
];

class Avatar {
  name: string;
  gender: number;
  skinTone: number;
  w: number;
  h: number;
  speed: number;
  curFrame: number;
  frames: number;
  dir: any;
  isMoving: boolean;
  canMove: boolean;
  x: number;
  y: number;
  lvl: number;
  lastMsg: string;
  msgTimer: number;
  msgMaxTime: number;
  msgFadeTime: number;

  constructor(
    name: string,
    gender: number,
    skinTone: number,
    width: number,
    height: number,
    speed: number,
    frames: number,
    dir: any,
    x: number,
    y: number,
    lvl: number
  ) {
    let nameLenLimit = 16;
    this.name = name.length > nameLenLimit ? name.substr(0, nameLenLimit) : name || "Anonymous";
    this.gender = gender || 0;
    this.skinTone = skinTone || 0;
    this.w = width || 0;
    this.h = height || 0;
    this.speed = speed || 0;
    this.curFrame = 1;
    this.frames = frames || 1;
    this.dir = dir || null;
    this.isMoving = false;
    this.canMove = true;
    this.x = x || 0;
    this.y = y || 0;
    this.lvl = lvl || 0;
    this.lastMsg = "";
    this.msgTimer = 0;
    this.msgMaxTime = 3000;
    this.msgFadeTime = 150;
  }

  sendMsg(msg: string) {

    if (msg.length > 0) {
      let isCmd = false;
      chatBar.curAutoCmpltCmd = -1;
      chatBar.arg1pg = -1;
      chatBar.arg2pg = -1;
      
      // update last message if not a command
      if (msg[0] != "/") {
        this.lastMsg = msg;
      } else {
        isCmd = true;
      }
      
      let chatLog = document.querySelector(".chat-log"),
        newEntry = document.createElement("span");
      
      // if command, execute if used by player (whose level is always 0,
      //and NPCs never send anything if they too are set at level 0)
      if (this.lvl === 0 && isCmd) {
        switch (msg.substr(1,msg.length - 1).split(" ")[0]) {
          // display help
          case "help":
            let helpHeading = "----- Help -----",
            cmdInfo: string[] = [],
              helpScrnTxt = "";

            for (var c in cmd) {
              cmdInfo[c] = "/" + cmd[c].name + " " + cmd[c].args + (cmd[c].args.length > 0 ? " " : "") + "- " + cmd[c].desc;
            }
            
            newEntry.className = "help-text";
            newEntry.appendChild(document.createTextNode(helpHeading));
            helpScrnTxt += helpHeading + "%";
            
            // show available commands
            for (var ci in cmdInfo) {
              newEntry.appendChild(document.createElement("br"));
              newEntry.appendChild(document.createTextNode(cmdInfo[ci]));
              helpScrnTxt += cmdInfo[ci] + "%";
            }
            
            screenText.updateText(helpScrnTxt,h - chatBar.barH - (screenText.fontS*1.5*(cmdInfo.length)),screenText.fontS*2*(cmdInfo.length),"#4f4");
            break;
            
          // clear chat
          case "clear":
            let clearMsg = "Chat cleared";
            chatLog.innerHTML = "";
            newEntry.appendChild(document.createTextNode(clearMsg));
            screenText.updateText(clearMsg,h - chatBar.barH,screenText.fontS*2, "#fff");
            break;
            
          // get entity details
          case "entityinfo":
            let eiArgs = msg.split(" "),
              eiTarget = eiArgs[1],
              eiSearch = worldObjs.find(s => s.name === eiTarget) || 0,
              eiFBLines = [],
              eiFeedback = "";
            
              if (eiSearch !== 0 && eiTarget) {
                eiFBLines[0] = "----- " + eiSearch.name +  " -----";
                eiFBLines[1] = "Gender - " + (eiSearch.gender === 0 ? "male" : "female");
                eiFBLines[2] = "Skin - " + eiSearch.skinTone;
                eiFBLines[3] = "Speed - " + eiSearch.speed;
                eiFBLines[4] = "Coordinates - " + Math.round(eiSearch.x) + "," + Math.round(eiSearch.y);
                eiFBLines[5] = "AI activity level - " + eiSearch.lvl;
                
                newEntry.className = "info-text";
                
                for (var ei in eiFBLines) {
                  newEntry.appendChild(document.createTextNode(eiFBLines[ei]));
                  newEntry.appendChild(document.createElement("br"));
                  eiFeedback += eiFBLines[ei] + "%";
                }

              } else {
                eiFeedback = !eiArgs[1] ? "Please specify an entity." : "Entity not found";
                newEntry.className = "error-text";
                newEntry.appendChild(document.createTextNode(eiFeedback));
              }
            
              let eiFBLen = eiFBLines.length > 0 ? eiFBLines.length : 1;
            
            screenText.updateText(eiFeedback,h - chatBar.barH - (screenText.fontS*1.5*(eiFBLen - 1)),screenText.fontS*2*(eiFBLen - 1),eiSearch !== 0 && eiArgs[1] ? "#ff4" : "#f44");
            break;
            
          // modify entity
          case "modentity":
            let meArgs = msg.split(" "),
              meTarget = meArgs[1],
              meName = meArgs[2],
              meGender = meArgs[3],
              meSkin = meArgs[4],
              meSpeed = meArgs[5],
              meLevel = meArgs[6],
              meSearch = worldObjs.find(s => s.name === meTarget) || 0,
              meInvalid = false,
              meValidArgCt = 0,
              meFeedback = "Entity modified successfully";
              const numericGender = parseInt(meGender, 10);
              const numericSkin = parseInt(meSkin, 10);
              const numericSpeed = parseInt(meSpeed, 10);
              const numericLevel = parseInt(meLevel, 10);


            
            if (meTarget) {
              if (meSearch !== 0) {
                if (meName) {
                  meValidArgCt = 2;
                  // check if new name isnt already used
                  let meNameUsed = worldObjs.find(ne => ne.name === meName) || 0;
                  if (meNameUsed === 0 || meTarget == meNameUsed.name) {
                    if (meGender) {
                      if ((numericGender >= 0 && numericGender <= 1) || meGender == "male" || meGender == "m" || meGender == "female" || meGender == "f") {
                        ++meValidArgCt;
                        if (meSkin) {
                          if (numericSkin >= 0 && numericSkin <= 2) {
                            ++meValidArgCt;
                            if (meSpeed) {
                              if (numericSpeed >= 0 && numericSpeed <= 9) {
                                ++meValidArgCt;
                                if (meLevel) {
                                  if (numericLevel >= 0 && numericLevel <= 20) {
                                    ++meValidArgCt;
                                    if (meTarget == player.name) {
                                      meInvalid = true;
                                      meFeedback = "Entity must be an NPC to modify AI activity level.";
                                    }
                                  } else {
                                    meInvalid = true;
                                    meFeedback = "Level must be between 0 and 20.";
                                  }
                                }
                              }  else {
                                meInvalid = true;
                                meFeedback = "Speed must be between 0 and 9.";
                              }
                            }
                          } else {
                            meInvalid = true;
                            meFeedback = "Skin must be between 0 and 2.";
                          }
                        }
                      } else {
                        meInvalid = true;
                        meFeedback = "Gender must be 0 or 1. m(ale) and f(emale) are also valid.";
                      }
                    }
                  } else {
                    meInvalid = true;
                    meFeedback = "'" + meNameUsed.name + "' has already been used. Please choose another name.";
                  }
                } else {
                  meInvalid = true;
                  meFeedback = "Please give at least a new name to use";
                }
              } else {
                meInvalid = true;
                meFeedback = "Entity does not exist.";
              }
            } else {
              meInvalid = true;
              meFeedback = "Usage: /modentity <name> <newname> [gender] [skin] [speed] [level]";
            }
            
            if (!meInvalid) {
              let nameLenLimit = 16;
              meSearch.name = meName.length > nameLenLimit ? meName.substr(0,nameLenLimit) : meName;
              if (meValidArgCt >= 3)
                meSearch.gender = meGender == "male" || meGender == "m" ? 0 : (meGender == "female" || meGender == "f" ? 1 : meGender);
              if (meValidArgCt >= 4)
                meSearch.skinTone = meSkin;
              if (meValidArgCt >= 5)
                meSearch.speed = +meSpeed;
              if (meValidArgCt == 6)
                meSearch.lvl = +meLevel;
            }
            
            newEntry.className = !meInvalid ? "" : "error-text";
            newEntry.appendChild(document.createTextNode(meFeedback));
            screenText.updateText(meFeedback,h - chatBar.barH,screenText.fontS*2,!meInvalid ? "#fff" : "#f44");
            break;
          
          // npc add/delete
          case "npc":
            let npcArgs = msg.split(" "),
              npcAction = npcArgs[1],
              npcName = npcArgs[2],
              npcGender = npcArgs[3],
              npcSkin = npcArgs[4],
              npcSpeed = npcArgs[5],
              npcLevel = npcArgs[6],
              npcX = npcArgs[7],
              npcY = npcArgs[8],
              npcFeedback = "NPC successfully added",
              npcInvalid = false,
              npcUsage = "Usage: /npc <add|del> <name> [gender] [skin] [speed] [level] [<x> <y>]";
              const numericNpcGender = parseInt(npcGender, 10);
              const numericNpcSkin = parseInt(npcSkin, 10);
              const numericNpcSpeed = parseInt(npcSpeed, 10);
              const numericNpcLevel = parseInt(npcLevel, 10);
              const numericNpcX = parseInt(npcX, 10);
              const numericNpcY = parseInt(npcY, 10);





            
            if (npcAction == "add") {
              if (npcName) {
                let npcNameUsed = worldObjs.find(np => np.name === npcName) || 0;
                if (npcNameUsed === 0) {
                  if (npcGender) {
                    if ((numericNpcGender >= 0 && numericNpcGender <= 1) || npcGender == "male" || npcGender == "m" || npcGender == "female" || npcGender == "f") {
                      if (npcSkin) {
                        if (numericNpcSkin >= 0 && numericNpcSkin <= 2) {
                          if (npcSpeed) {
                            if (numericNpcSpeed >= 0 && numericNpcSpeed <= 9) {
                              if (npcLevel) {
                                if (numericNpcLevel >= 0 || numericNpcLevel <= 20) {
                                  if (npcX) {
                                    if (npcY) {
                                      if (!isNaN(numericNpcX) && !isNaN(numericNpcY)) {
                                        let xMax = canvas.offsetWidth;
                                        if (numericNpcX < 0 && numericNpcX > xMax && numericNpcY < 0 && numericNpcY > h - chatBar.barH) {
                                          
                                          npcInvalid = true;
                                          npcFeedback = "Placement is out of bounds. X limit is 0-" + xMax + ". Y limit is 0-" + (h - chatBar.barH) + ".";
                                        }
                                      } else {
                                        npcInvalid = true;
                                        npcFeedback = "Placement coordinates are invalid.";
                                      }
                                    } else {
                                      npcInvalid = true;
                                      npcFeedback = "Placement coordinates need both X and Y.";
                                    }
                                  }
                                } else {
                                  npcInvalid = true;
                                  npcFeedback = "Level must be between 0 and 20.";
                                }
                              }
                            }  else {
                              npcInvalid = true;
                              npcFeedback = "Speed must be between 0 and 9.";
                            }
                          }
                        } else {
                          npcInvalid = true;
                          npcFeedback = "Skin must be between 0 and 2.";
                        }
                      }
                    } else {
                      npcInvalid = true;
                      npcFeedback = "Gender must be 0 or 1. m(ale) and f(emale) are also valid.";
                    }
                  }
                } else {
                  npcInvalid = true;
                  npcFeedback = "'" + npcNameUsed.name + "' has already been used. Please choose another name.";
                }
              } else {
                npcInvalid = true;
                npcFeedback = "Please choose at least a name for the NPC.";
              }

              if (!npcInvalid) {
                let aGender: number;

                if (npcGender === "male" || npcGender === "m") {
                  aGender = 0;
                } else if (npcGender === "female" || npcGender === "f") {
                  aGender = 1;
                } else {
                  aGender = 0;
                }
                
                let aSkin: number;

                if (typeof npcSkin === "number") {
                  aSkin = npcSkin;
                } else {
                  // Eğer npcSkin bir string ise, uygun bir sayıya dönüştürülmelidir.
                  aSkin = parseInt(npcSkin) || 0; // Varsayılan olarak 0 kabul ediyoruz.
                }
                
                  let aSpeed = npcSpeed || 3,
                  aLevel = npcLevel || 8,
                  aX = npcX || player.x,
                  aY = npcY || player.y,
                  newNPC = new Avatar(npcName,aGender,aSkin,30,60,+aSpeed,28,2,+aX,+aY,+aLevel);

                  npcs.push(newNPC);
                  worldObjs.push(npcs[npcs.length - 1]);
              }
            
            } else if (npcAction == "del") {
              if (npcName) {
                let npcSearch: Avatar | number  = npcs.find(s => s.name === npcName) || 0;
                if (npcSearch !== 0 && npcSearch instanceof Avatar) {
                  for (const npc of npcs) {
                    if (npc.name === npcSearch.name) {
                      const npcIndex = npcs.indexOf(npc);
                      if (npcIndex !== -1) {
                        npcs.splice(npcIndex, 1);
                      }
                    }
                  }
                  for (const obj of worldObjs) {
                    if (obj.name === npcSearch.name) {
                      const objIndex = worldObjs.indexOf(obj);
                      if (objIndex !== -1) {
                        worldObjs.splice(objIndex, 1);
                      }
                    }
                  }
                  npcFeedback = "NPC successfully deleted";
                }
                 else {
                  npcInvalid = true;
                  npcFeedback = "Could not find that NPC to delete";
                }
              } else {
                npcInvalid = true;
                npcFeedback = "Please specify an NPC to delete.";
              }
            } else {
              npcInvalid = true;
              npcFeedback = npcUsage;
            }
            
            newEntry.className = !npcInvalid ? "" : "error-text";
            newEntry.appendChild(document.createTextNode(npcFeedback));
            screenText.updateText(npcFeedback,h - chatBar.barH,screenText.fontS*2,!npcInvalid ? "#fff" : "#f44");
            
            break;
          
          // teleport
          case "tp":
            let tpArgs = msg.split(" "),
              tpEntity = tpArgs[1],
              tpAfterEn = tpArgs[2],
              enSearch = worldObjs.find(s => s.name === tpEntity) || 0,
              rel = "~",
              tpOK = false,
              tpFeedback = "",
              tpUsage = "Usage: /tp <name> <x> <y> or <name> <targetname>";
              const numericTpAfterEn = parseInt(tpAfterEn, 10);
              
            if (tpAfterEn) {
              if (isNaN(numericTpAfterEn) && tpAfterEn[0] != rel) {
                let tarEntity = tpAfterEn,
                  tEnSearch = worldObjs.find(ts => ts.name === tarEntity) || 0,
                  bothNames = tpEntity && tarEntity ? true : false;
              
                tpOK = bothNames && enSearch !== 0 && tEnSearch !== 0 ? true : false;
                tpFeedback = bothNames ? (enSearch !== 0 ? (tEnSearch !== 0 ? "Teleported " + tpEntity + " to " + tarEntity : "Target entity does not exist") : "Entity does not exist") : tpUsage;
              
                if (tpOK) {
                  enSearch.x = tEnSearch.x;
                  enSearch.y = tEnSearch.y;
                }
              
              } else {
                
                let tpX: number | string = "",
                tpY: number | string = tpArgs[3];
            
            // Kontrol ve gerekirse dönüşüm
            if (typeof tpX === "string") {
              if (tpX[0] == rel) {
                tpX = +tpX.substr(1, tpX.length - 1) + enSearch.x;
              } else {
                tpX = +tpX;
              }
            }
            
            if (typeof tpY === "string") {
              if (tpY[0] == rel) {
                tpY = +tpY.substr(1, tpY.length - 1) + enSearch.y;
              } else {
                tpY = +tpY;
              }
            }
            
            // Diğer kodlar devam ediyor...
            let cw = canvas.offsetWidth,
                tpXIsNumber = typeof tpX === "number",
                tpYIsNumber = typeof tpY === "number",
                allValues = tpEntity && (tpXIsNumber || tpX === 0) && (tpYIsNumber || tpY === 0) ? true : false,
                wthnScrn = (typeof tpX === "number" && tpX >= 0 && tpX <= cw) && (typeof tpY === "number" && tpY >= 0 && tpY <= h - chatBar.barH) ? true : false;

                tpOK = enSearch !== 0 && allValues && wthnScrn ? true : false,
                tpFeedback = allValues ? (enSearch !== 0 ? (wthnScrn ? "Teleported " + tpEntity + " to " + Math.round(tpX as number) + "," + Math.round(tpY as number) : "Coordinates are out of bounds. X limit is 0-" + cw + ". Y limit is 0-" + (h - chatBar.barH) + ".") : "Entity does not exist.") : tpUsage;
                if (tpOK) {
                  enSearch.x = tpX;
                  enSearch.y = tpY;
                }
              }
            } else {
              tpFeedback = tpUsage;
            }
            
            newEntry.className = tpOK ? "" : "error-text";
            newEntry.appendChild(document.createTextNode(tpFeedback));
            screenText.updateText(tpFeedback,h - chatBar.barH,screenText.fontS*2,tpOK ? "#fff" : "#f44");
            break;
          
          // get list of all entities in alphabetical order
          case "who":
            let getEntities = [player.name],
              displayEntNames = "Entity list: ";
            
            for (var ge in npcs) {
              const index = +ge;
              getEntities[index + 1] = npcs[index].name;
            }
            
            getEntities.sort(function(a, b){
                if (a.toLowerCase() < b.toLowerCase())
                return -1;
                if (a.toLowerCase() > b.toLowerCase())
                return 1;
                return 0;
            });
            
            for (let i = 0; i < getEntities.length; i++) {
              const de = getEntities[i];
              displayEntNames += (i > 0 ? ", " : "") + de;
            }
            
            
            newEntry.appendChild(document.createTextNode(displayEntNames));
            screenText.updateText(displayEntNames, h - chatBar.barH, screenText.fontS * 2, "");
            break;
          
          // invalid command
          default:
            let cmdErr = "Invalid command. See /help for a list of available commands.";
            
            newEntry.className = "error-text";
            newEntry.appendChild(document.createTextNode(cmdErr));
            screenText.updateText(cmdErr,h - chatBar.barH,screenText.fontS*2,"#f44");
            break;
        }
        
      } else {
        this.msgTimer = this.msgMaxTime;
        newEntry.appendChild(document.createTextNode(this.name + ": " + this.lastMsg));
      }
      // add new line
      chatLog.insertBefore(newEntry, chatLog.childNodes[0]);
      
      // cut off oldest line if at max lines allowed
      if (chatLog.childNodes.length > chatBar.maxLines) {
        chatLog.removeChild(chatLog.getElementsByTagName("span")[chatBar.maxLines]);
      }
    }
  
  }
}
    
class Structure {
  w: number;
  h: number;
  x: number;
  y: number;
  backArea: number;
  img: string | null;
  isAnim: boolean;
  frames: number;
  curFrame: number;

  constructor(
    width: number,
    height: number,
    x: number,
    y: number,
    backArea: number = 0,
    img: string | null = null,
    isAnim: boolean = false,
    frames: number = 1
  ) {
    this.w = width;
    this.h = height;
    this.x = x;
    this.y = y;
    this.backArea = backArea;
    this.img = img;
    this.isAnim = img !== null && isAnim;
    this.frames = frames;
    this.curFrame = 1;
  }
}
const randNum = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const collision = (a: any, b: any): boolean => {
  if (
    ((a.y < b.y + b.h + 6 - b.backArea && a.y > b.y) ||
      (a.y > b.y && a.y < b.y + b.h - b.backArea)) &&
    ((a.x + a.w > b.x && a.x + a.w < b.x + b.w) || (a.x < b.x + b.w && a.x > b.x))
  ) {
    return true;
  } else {
    return false;
  }
};

const findCllsn = (a: any, b: any): boolean => {
  for (const bi of b) {
    if (collision(a, bi) && Array.isArray(b)) {
      return true;
    }
  }
  return false;
};

const player: Avatar = new Avatar("Player", 0, 0, 30, 60, 3, 28, 2, w / 2 - 15, h * 0.8 - chatBar.barH, 0);
const npcs: Avatar[] = [];
const structures: Structure[] = [
  new Structure(w, 50, 0, -40),
  new Structure(10, h - chatBar.barH - 10, 0, 10),
  new Structure(10, h - chatBar.barH - 10, w - 10, 10),
  new Structure(300, 200, w / 2 - 150, 100, 70, images[1].src, true, 12)
];
const worldObjs: any[] = [],

createNPCs = (): void => {
  class NameObj {
    constructor(public name: string, public gender: number) {}
  }

  const npcNames: NameObj[] = [
    new NameObj("Alice", 1),
    new NameObj("Jack", 0),
    new NameObj("Jill", 1)
  ];

  const avatarW: number = 30;
  const avatarH: number = 60;

  for (const npc of npcNames) {
    const chooseSkin: number = randNum(0, 3);
    const placeX: number = randNum(0, w - avatarW);
    const placeY: number = randNum(avatarH, h - chatBar.barH - avatarH);

    const newNPC: Avatar = new Avatar(npc.name, npc.gender, chooseSkin, avatarW, avatarH, 3, 28, 2, placeX, placeY, 8);

    // relocate to player location if ended up inside structure
    if (findCllsn(newNPC, structures)) {
      newNPC.x = player.x;
      newNPC.y = player.y;
    }

    npcs.push(newNPC);
    worldObjs.push(newNPC);
  }
},

control = (avatar: Avatar, e: KeyboardEvent): void => {
  // avatar.dir values: 0 = up, 1 = right, 2 = down, 3 = left
  if (e && !chatBar.active) {
    avatar.isMoving = true;
    avatar.canMove = true;
    switch (e.keyCode) {
      case 37:
        avatar.dir = 3;
        break;
      case 38:
        avatar.dir = 0;
        break;
      case 39:
        avatar.dir = 1;
        break;
      case 40:
        avatar.dir = 2;
        break;
      default:
        avatar.canMove = false;
        break;
    }
  }
};

const stopControl = (avatar: Avatar): void => {
  avatar.isMoving = false;
};

const avatarSpriteLoop = (avatar: Avatar): void => {
  if (avatar.curFrame === avatar.frames) {
    avatar.curFrame = 1;
  } else {
    ++avatar.curFrame;
  }
};

const moveAvatar = (avatar: Avatar): void => {
  if (avatar.isMoving && avatar.canMove) {
    switch (avatar.dir) {
      case 3:
        avatar.x -= avatar.speed;
        // collision with right side of structure, collisions apply to walls as well
        if (findCllsn(avatar, structures) || avatar.x < 0) {
          avatar.x += avatar.speed;
          avatar.curFrame = 1;
        } else {
          avatarSpriteLoop(avatar);
        }
        break;
      case 0:
        avatar.y -= avatar.speed;
        // bottom side
        if (findCllsn(avatar, structures) || avatar.y < 0) {
          avatar.y += avatar.speed;
          avatar.curFrame = 1;
        } else {
          avatarSpriteLoop(avatar);
        }
        break;
      case 1:
        avatar.x += avatar.speed;
        // left side
        if (findCllsn(avatar, structures) || avatar.x + avatar.w > w) {
          avatar.x -= avatar.speed;
          avatar.curFrame = 1;
        } else {
          avatarSpriteLoop(avatar);
        }
        break;
      case 2:
        avatar.y += avatar.speed;
        // top side
        if (findCllsn(avatar, structures) || avatar.y + avatar.h > h) {
          avatar.y -= avatar.speed;
          avatar.curFrame = 1;
        } else {
          avatarSpriteLoop(avatar);
        }
        break;
      default:
        break;
    }
  } else {
    avatar.curFrame = 1;
  }
};

const npcAI = (npc: Avatar): void => {
  if (npc.lvl > 0) {
    npc.isMoving = randNum(0, npc.lvl + 1) === 0 ? false : true;
    // just like player, NPCs can chat if not moving
    if (npc.isMoving) {
      npc.dir = randNum(0, 4);
    } else {
      const msgs = ["😆", "😊", "😴", "❤️"];
      const msgChance = 0.05 * npc.lvl;
      const numFromBag = +Math.random().toFixed(2);

      if (numFromBag < msgChance) {
        npc.sendMsg(msgs[randNum(0, msgs.length)]);
      }
    }
  }
};

function drawStructure(strctr: Structure) {
  if (strctr.img === null) {
    ctx.fillStyle = "#aaa";
    ctx.fillRect(strctr.x, strctr.y, strctr.w, strctr.h);
  } else if (strctr.isAnim) {
    const image = loadImage(strctr.img);
    if (image) {
      ctx.drawImage(
        image,
        strctr.w * (strctr.curFrame - 1),
        0,
        strctr.w,
        strctr.h,
        strctr.x,
        strctr.y - strctr.backArea,
        strctr.w,
        strctr.h
      );
      ++strctr.curFrame;
      if (strctr.curFrame > strctr.frames) {
        strctr.curFrame = 1;
      }
    }
  } else {
    const image = loadImage(strctr.img);
    if (image) {
      ctx.drawImage(image, strctr.x, strctr.y, strctr.w, strctr.h);
    }
  }
}

function loadImage(url: string): HTMLImageElement | null {
  const image = new Image();
  image.src = url;
  if (image.complete) {
    return image;
  } else {
    return null;
  }
}

function drawAvatar(avatar: Avatar) {
  const lastMsg = avatar.lastMsg;
  
  // Chat bubble
  if (lastMsg.length > 0 && avatar.msgTimer > 0) {
    const fontS = 16;
    const fadeTime = avatar.msgFadeTime;
    const latinPat = /\w+/;
    const isNotLatin = !latinPat.test(lastMsg);
    const lineLimit = 16;
    const lines: string[] = [""];
    let longestLnLen = 4;
    const strS: string[] = isNotLatin ? [lastMsg] : lastMsg.split(" ");

    // Break up message into lines
    for (const [lm, str] of strS.entries()) {
      let l = lines.length - 1;
      lines[l] += (str + (lm !== strS.length - 1 && !isNotLatin ? " " : ""));

      if (lines[l].length > lineLimit) {
        if (lines[l].length > longestLnLen) {
          longestLnLen = lines[l].length;
        }
        lines.push("");
      }
    }
    
    // For one line only, make its current length the longest
    if (lines.length === 1) {
      longestLnLen = lines[0].length;
    }
    
    // Cut off last line if empty
    if (lines[lines.length - 1] === "") {
      lines.pop();
    }
    
    // Fade in
    const msgTimeFwd = avatar.msgMaxTime - avatar.msgTimer;
    if (msgTimeFwd < fadeTime) {
      ctx.globalAlpha = msgTimeFwd / fadeTime;
    }
    
    // Fade out
    if (avatar.msgTimer < fadeTime) {
      ctx.globalAlpha = avatar.msgTimer / fadeTime;
    }
    
    const wMult = isNotLatin ? 0.7 : 1.2;
    const bubble = new BubbleObj(lastMsg, longestLnLen * fontS * wMult, avatar.x + avatar.w / 2, avatar.y - avatar.h - 35);
    
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    
    // Oval
    ctx.beginPath();
    const bubbleY = bubble.y - (fontS * (lines.length - 1));
    const bubbleH = fontS * 3 * lines.length;
    const bottomLnSt = (fontS * 0.6) * (lines.length - 1);
    
    // Top half
    ctx.moveTo(bubble.x - bubble.w / 2, bubbleY);
    ctx.bezierCurveTo(bubble.x - bubble.w / 2, bubbleY - bubbleH / 2, (bubble.x - bubble.w / 2) + bubble.w, bubbleY - bubbleH / 2, (bubble.x - bubble.w / 2) + bubble.w, bubbleY);
    
    // Bottom half
    ctx.moveTo(bubble.x - bubble.w / 2, bubbleY);
    ctx.quadraticCurveTo(bubble.x - bubble.w / 2, bubbleY + bubbleH / 4, bubble.x - 5, bubbleY + bubbleH / 3);
    ctx.lineTo(bubble.x, bubbleY + (fontS * 2 * lines.length) - (fontS * (lines.length - 1)));
    ctx.lineTo(bubble.x + 5, bubbleY + bubbleH / 3);
    ctx.quadraticCurveTo(bubble.x + bubble.w / 2, bubbleY + bubbleH / 4, bubble.x + bubble.w / 2, bubbleY);
    
    ctx.fill();
    ctx.closePath();
    
    // Text
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = fontS + "px Arial";
    
    // Write each line on bubble
    for (const [bl, line] of lines.entries()) {
      ctx.fillText(line, bubble.x, bubbleY + bottomLnSt - ((fontS * 1.2) * bl));
    }
    
    ctx.globalAlpha = 1;
    
    avatar.msgTimer -= 1000 / 60;
    
    if (avatar.msgTimer < 0) {
      avatar.msgTimer = 0;
    }
  }
  
  // Avatar shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.beginPath();
  ctx.moveTo(avatar.x, avatar.y);
  ctx.bezierCurveTo(avatar.x + avatar.w / 5, avatar.y - avatar.w / 3, avatar.x + avatar.w / (5 / 4), avatar.y - avatar.w / 3, avatar.x + avatar.w, avatar.y);
  ctx.moveTo(avatar.x, avatar.y);
  ctx.bezierCurveTo(avatar.x + avatar.w / 5, avatar.y + avatar.w / 3, avatar.x + avatar.w / (5 / 4), avatar.y + avatar.w / 3, avatar.x + avatar.w, avatar.y);
  ctx.fill();
  ctx.closePath();
  
  // Avatar
  ctx.drawImage(
    avatar.gender === 1 ? images[3] : images[2],
    avatar.w * (avatar.curFrame - 1) + (avatar.w * avatar.frames * avatar.dir),
    avatar.h * avatar.skinTone,
    avatar.w,
    avatar.h,
    avatar.x,
    avatar.y - avatar.h,
    avatar.w,
    avatar.h
  );
  
  // Name
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.font = "14px Arial";
  ctx.fillText(avatar.name, avatar.x + avatar.w / 2, avatar.y + 4);
  ctx.fillStyle = avatar.name === player.name ? "#ff4" : "#fff";
  ctx.fillText(avatar.name, avatar.x + avatar.w / 2, avatar.y + 3);
}

function writeScrnText(txtObj: typeof screenText) {
  if (txtObj.timer > 0) {
    if (!chatBar.showLog) {
      const adj = 2;
      const fadeTime = txtObj.fadeTime;
      const txtTimeFwd = txtObj.maxTime - txtObj.timer;

      // Fade in
      if (txtTimeFwd < fadeTime) {
        ctx.globalAlpha = txtTimeFwd / fadeTime;
      }
      // Fade out
      if (txtObj.timer < fadeTime) {
        ctx.globalAlpha = txtObj.timer / fadeTime;
      }

      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, txtObj.y - adj - txtObj.fontS * 2, w, txtObj.h + adj);
      ctx.textAlign = "left";
      ctx.font = txtObj.fontS + "px Arial";
      ctx.fillStyle = txtObj.color;

      const lines = txtObj.text.split("%");
      for (const [l, line] of lines.entries()) {
        ctx.fillText(line, 5, txtObj.y - adj - (txtObj.fontS * 1.5 * -(l - 1)));
      }

      ctx.globalAlpha = 1;
    }

    txtObj.timer -= 1000 / 60;

    if (txtObj.timer < 0) {
      txtObj.timer = 0;
    }
  }
}

function drawScreen() {
  ctx.clearRect(0, 0, w, h);

  const ground = ctx.createPattern(images[0], 'repeat');
  const pathW = 50;
  const path = ctx.createLinearGradient(w / 2 - pathW / 2, 0, w / 2 + pathW / 2, 0);

  path.addColorStop(0.05, "#863");
  path.addColorStop(0.05, "#974");
  path.addColorStop(0.95, "#974");
  path.addColorStop(0.95, "#753");

  ctx.fillStyle = ground;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = path;
  ctx.fillRect(w / 2 - pathW / 2, 220, pathW, 210);

  // Sort avatars and structures ascending by Y position so that they each aren't standing on top of another
  worldObjs.sort(function (a, b) {
    return a.y - b.y;
  });

  // Render everything
  for (const wo of worldObjs) {
    // To determine if avatar, test for name
    if ('name' in wo) {
      moveAvatar(wo);
      drawAvatar(wo);
    } else {
      drawStructure(wo);
    }
  }

  // Screen text
  writeScrnText(screenText);
}

function runAI() {
  for (const ai in npcs) {
    npcAI(npcs[ai]);
  }
  setTimeout(runAI, 400);
}

function runDisplay() {
  drawScreen();
  setTimeout(runDisplay, 1000 / 60);
}

function start() {
  chatBar.create();
  createNPCs();
  // load player and NPCs
  worldObjs[0] = player;
  let snIndex = 1;
  for (const npc of npcs) {
    worldObjs[snIndex] = npc;
    snIndex++;
  }
  // load structures
  const avatars = worldObjs.length;
  let ssIndex = avatars;
  for (const structure of structures) {
    worldObjs[ssIndex] = structure;
    ssIndex++;
  }
  // onboarding
  const onboardingTxt = "Welcome! To get started, enter /help for commands.";
  const chatLog = document.querySelector(".chat-log");
  const newEntry = document.createElement("span");

  newEntry.className = "info-text";
  newEntry.appendChild(document.createTextNode(onboardingTxt));
  chatLog.insertBefore(newEntry, chatLog.childNodes[0]);
  screenText.updateText(onboardingTxt, h - chatBar.barH, screenText.fontS * 2, "#ff4");
  // run everything!
  runAI();
  runDisplay();
}

start();

// player moving
document.addEventListener("keydown", function (e) {
  let field = document.querySelector("input") as HTMLInputElement,
      send = document.querySelector(".send") as HTMLButtonElement,
      viewChat = document.querySelector(".view-chat") as HTMLButtonElement;

  // Send button availability
  setTimeout(function () {
      send.disabled = field.value.length > 0 ? false : true;
  }, 10);

  // Move only if not using chat
if (!chatBar.active) {
  control(player, e);
} else if (chatBar.history.length > 0) {
  // Back
  if (e.keyCode === 38 && chatBar.curHistoryItem !== chatBar.history.length - 1) {
      ++chatBar.curHistoryItem;
      field.value = chatBar.history[chatBar.history.length - chatBar.curHistoryItem - 1];
      // Move insertion point to end
      e.preventDefault();
      if (typeof field.selectionStart === "number") {
          field.selectionStart = field.selectionEnd = field.value.length;
      }
  } else if (e.keyCode === 40 && chatBar.curHistoryItem > -1) {
      --chatBar.curHistoryItem;
      field.value = chatBar.curHistoryItem === -1 ? "" : chatBar.history[chatBar.history.length - chatBar.curHistoryItem - 1];
  }
}

  // autocomplete commands
  let spaces = 0;
  for (const char of field.value) {
      if (char === " ") {
          ++spaces;
      }
  }
  
  chatBar.autoCmpltLvl = spaces;
  if (e.keyCode == 9 && field.value[0] == "/" && chatBar.active) {
      e.preventDefault();
      let chatLog = document.querySelector(".chat-log") as HTMLElement,
          availOpts = document.createElement("span"),
          entityResults = [player.name],
          displayEntResults = "";
      for (const npc of npcs) {
          entityResults.push(npc.name);
      }
      entityResults.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
      for (let der = 0; der < entityResults.length; der++) {
          displayEntResults += (der > 0 ? ", " : "") + entityResults[der];
      }
      if (chatBar.autoCmpltLvl === 0) {
          let curString = field.value.substr(1, field.value.length - 1),
              foundCmdMatch = false;
          for (let fm = 0; fm < cmd.length; fm++) {
              if (cmd[fm].name.indexOf(curString) === 0 && curString.length >= 1 && curString != cmd[fm].name) {
                  chatBar.curAutoCmpltCmd = fm;
                  foundCmdMatch = true;
                  field.value = "/" + cmd[chatBar.curAutoCmpltCmd].name;
              }
          }
          if (!foundCmdMatch && field.value.length > 0 && (cmd.find(c => c.name == curString) || field.value == "/")) {
              if (chatBar.curAutoCmpltCmd == -1) {
                  let getCmds = "";
                  for (let ac = 0; ac < cmd.length; ac++) {
                      getCmds += (ac > 0 ? ", " : "") + "/" + cmd[ac].name;
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
      }else if (chatBar.autoCmpltLvl === 1) {
        let curCmd = field.value.split(" ")[0].substring(1);
        let cmdInHand = cmd.find(c => c.name === curCmd);
        
        if (cmdInHand && cmdInHand.args) {
            let reqArgs = (cmdInHand.args.match(/</g) || []).length;
            if (reqArgs >= 1) {
                let arg1Result = "";
                if (cmdInHand.args.indexOf("name") === 1) {
                    if (chatBar.arg1pg === -1) {
                        availOpts.appendChild(document.createTextNode(displayEntResults));
                        chatLog.insertBefore(availOpts, chatLog.childNodes[0]);
                    }
                    ++chatBar.arg1pg;
                    if (chatBar.arg1pg > entityResults.length - 1) {
                        chatBar.arg1pg = 0;
                    }
                    arg1Result = entityResults[chatBar.arg1pg];
                } else if (cmdInHand.args.indexOf("add") === 1 || cmdInHand.args.indexOf("del") === 1) {
                    let opResults = ["add", "del"];
                    if (chatBar.arg1pg === -1) {
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
        }
    } else if (chatBar.autoCmpltLvl === 2) {
        let curCmd = field.value.substring(1).split(" ");
        let cmdInHand = cmd.find(c => c.name === curCmd[0]);
        
        if (cmdInHand && cmdInHand.args) {
            let curArgs = curCmd[1];
            let reqArgs = (cmdInHand.args.match(/</g) || []).length;
            if (reqArgs >= 2) {
                if (cmdInHand.args.indexOf("name") > -1) {
                    if (chatBar.arg2pg === -1) {
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
    }
     else {
      chatBar.curAutoCmpltCmd = -1;
      chatBar.arg1pg = -1;
      chatBar.arg2pg = -1;
  }
  // toggle chat with V
    if (e.key === "v" && !chatBar.active) {
      e.preventDefault();
      chatBar.logToggle();
  } else if (e.key === "/" && !chatBar.active) {
      field.value = "";
      chatBar.logToggle();
  } else if (e.key === "Escape") {
      chatBar.active = false;
      chatBar.logHide();
      field.blur();
      send.blur();
      viewChat.blur();
  }
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
      if (field && field.value.length > 0) {
          player.sendMsg(field.value);
          chatBar.history.push(field.value);
          chatBar.curHistoryItem = -1;
          if (!chatBar.showLog) {
              chatBar.active = false;
              field.blur();
          }
      }
      if (field) {
          field.value = "";
      }
    });
    // show/hide chat using button
    document.querySelector(".view-chat")?.addEventListener("click", function (e) {
      e.preventDefault();
      chatBar.logToggle();
    });
    // also hide log if clicked outside
    canvas?.addEventListener("click", function () {
      chatBar.logHide();
    });
  }
}