export class avatarObj {
  name: string;
  gender: any;
  skinTone: any;
  w: number;
  h: number;
  speed: number;
  curFrame: number;
  frames: number;
  dir: number;
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
    gender: any,
    skinTone: any,
    w: number,
    h: number,
    speed: number,
    frames: number,
    dir: number,
    x: number,
    y: number,
    lvl: number,
  ) {
	const nameLenLimit = 16;
    this.name = name.length > nameLenLimit ? name.substr(0, nameLenLimit) : name || "Anonymous";
    this.gender = gender || 0;
    this.skinTone = skinTone || 0;
    this.w = w || 0;
    this.h = h || 0;
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
		// update last message if not a command
		if (msg[0] != "/") {
			this.lastMsg = msg;
		} else {
			isCmd = true;
		}
		this.msgTimer = this.msgMaxTime;
	}
};


  /* sendMsg(msg: string, npcs: any[], worldObjs: any[], canvas: HTMLCanvasElement){

		if (msg.length > 0) {
			let isCmd = false;
			this.chatBarObj.curAutoCmpltCmd = -1;
			this.chatBarObj.arg1pg = -1;
			this.chatBarObj.arg2pg = -1;

			// update last message if not a command
			if (msg[0] != "/") {
				this.lastMsg = msg;
			} else {
				isCmd = true;
			}

			let chatLog = document.querySelector(".chat-log"),
				newEntry = document.createElement("span");

			//if command, execute if used by player (whose level is always 0,
			//and NPCs never send anything if they too are set at level 0) 
			if (this.lvl === 0 && isCmd) {
				switch (msg.substr(1, msg.length - 1).split(" ")[0]) {
					case "entityinfo":
						let eiArgs = msg.split(" "),
							eiTarget = eiArgs[1],
							eiSearch = worldObjs.find(s => s.name === eiTarget) || 0,
							eiFBLines = [],
							eiFeedback = "";

						if (eiSearch !== 0 && eiTarget) {
							eiFBLines[0] = "----- " + eiSearch.name + " -----";
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

						this.textService.screenText.updateText(eiFeedback, this.h - this.chatBarObj.barH - (this.textService.screenText.fontS * 1.5 * (eiFBLen - 1)), this.textService.screenText.fontS * 2 * (eiFBLen - 1), eiSearch !== 0 && eiArgs[1] ? "#ff4" : "#f44");
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

						if (meTarget) {
							if (meSearch !== 0) {
								if (meName) {
									meValidArgCt = 2;
									// check if new name isnt already used
									let meNameUsed = worldObjs.find(ne => ne.name === meName) || 0;
									if (meNameUsed === 0 || meTarget == meNameUsed.name) {
										if (meGender) {
											if ((parseInt(meGender) >= 0 && parseInt(meGender) <= 1) || meGender == "male" || meGender == "m" || meGender == "female" || meGender == "f") {
												++meValidArgCt;
												if (meSkin) {
													if (parseInt(meSkin) >= 0 && parseInt(meSkin) <= 2) {
														++meValidArgCt;
														if (meSpeed) {
															if (parseInt(meSpeed) >= 0 && parseInt(meSpeed) <= 9) {
																++meValidArgCt;
																if (meLevel) {
																	if (parseInt(meLevel) >= 0 && parseInt(meLevel) <= 20) {
																		++meValidArgCt;
																		if (meTarget == this.name) {
																			meInvalid = true;
																			meFeedback = "Entity must be an NPC to modify AI activity level.";
																		}
																	} else {
																		meInvalid = true;
																		meFeedback = "Level must be between 0 and 20.";
																	}
																}
															} else {
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
							meSearch.name = meName.length > nameLenLimit ? meName.substr(0, nameLenLimit) : meName;
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
						this.textService.screenText.updateText(meFeedback, this.h - this.chatBarObj.barH, this.textService.screenText.fontS * 2, !meInvalid ? "#fff" : "#f44");
						break;

					
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

						if (npcAction == "add") {
							if (npcName) {
								let npcNameUsed = worldObjs.find(np => np.name === npcName) || 0;
								if (npcNameUsed === 0) {
									if (npcGender) {
										if ((parseInt(npcGender) >= 0 && parseInt(npcGender) <= 1) || npcGender == "male" || npcGender == "m" || npcGender == "female" || npcGender == "f") {
											if (npcSkin) {
												if (parseInt(npcSkin) >= 0 && parseInt(npcSkin) <= 2) {
													if (npcSpeed) {
														if (parseInt(npcSpeed) >= 0 && parseInt(npcSpeed) <= 9) {
															if (npcLevel) {
																if (parseInt(npcLevel) >= 0 || parseInt(npcLevel) <= 20) {
																	if (npcX) {
																		if (npcY) {
																			if (!isNaN(parseInt(npcX)) && !isNaN(parseInt(npcY))) {
																				let xMax = canvas.offsetWidth;
																				if (parseInt(npcX) < 0 && parseInt(npcX) > xMax && parseInt(npcY) < 0 && parseInt(npcY) > this.h - this.chatBarObj.barH) {

																					npcInvalid = true;
																					npcFeedback = "Placement is out of bounds. X limit is 0-" + xMax + ". Y limit is 0-" + (this.h - this.chatBarObj.barH) + ".";
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
														} else {
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
								let aGender = (npcGender == "male" || npcGender == "m" ? 0 : (npcGender == "female" || npcGender == "f" ? 1 : npcGender)) || 0,
									aSkin = npcSkin || 0,
									aSpeed = npcSpeed || 3,
									aLevel = npcLevel || 8,
									aX = npcX || this.x,
									aY = npcY || this.y,
									newNPC = new avatarObj(npcName, aGender, aSkin, 30, 60, +aSpeed, 28, 2, +aX, +aY, +aLevel);

								npcs.push(newNPC);
								worldObjs.push(npcs[npcs.length - 1]);
							}

						} else if (npcAction == "del") {
							if (npcName) {
								let npcSearch = npcs.find(s => s.name === npcName) || null;
								if (npcSearch !== null) {

									for (var n in npcs) {
										if (npcs[n].name == npcSearch.name) {
											npcs.splice(parseInt(n), 1);
										}
									}
									for (var w in worldObjs) {
										if (worldObjs[w].name == npcSearch.name) {
											worldObjs.splice(parseInt(w), 1);
										}
									}

									npcFeedback = "NPC successfully deleted";
								} else {
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
						this.textService.screenText.updateText(npcFeedback, this.h - this.chatBarObj.barH, this.textService.screenText.fontS * 2, !npcInvalid ? "#fff" : "#f44");

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

						if (tpAfterEn) {
							if (isNaN(parseInt(tpAfterEn)) && tpAfterEn[0] != rel) {
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
								let tpX = tpAfterEn,
									tpY = tpArgs[3];

								if (tpX && tpY) {
									// convert relative positions to regular
									if (tpX[0] == rel) {
										tpX = +tpX.substr(1, tpX.length - 1) + enSearch.x;
									} else {
										tpX = parseInt(tpX).toString();
									}
									if (tpY[0] == rel) {
										tpY = +tpY.substr(1, tpY.length - 1) + enSearch.y;
									} else {
										tpY = parseInt(tpY).toString();
									}
								}

								let cw = canvas.offsetWidth,
									allValues = tpEntity && (tpX || parseInt(tpX) === 0) && (tpY || parseInt(tpY) === 0) ? true : false,
									wthnScrn = parseInt(tpX) >= 0 && parseInt(tpX) <= cw && parseInt(tpY) >= 0 && parseInt(tpY) <= this.h - this.chatBarObj.barH ? true : false;

								tpOK = enSearch !== 0 && allValues && wthnScrn ? true : false,
									tpFeedback = allValues ? (enSearch !== 0 ? (wthnScrn ? "Teleported " + tpEntity + " to " + Math.round(parseInt(tpX)) + "," + Math.round(parseInt(tpY)) : "Coordinates are out of bounds. X limit is 0-" + cw + ". Y limit is 0-" + (this.h - this.chatBarObj.barH) + ".") : "Entity does not exist.") : tpUsage;
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
						this.textService.screenText.updateText(tpFeedback, this.h - this.chatBarObj.barH, this.textService.screenText.fontS * 2, tpOK ? "#fff" : "#f44");
						break;

					// get list of all entities in alphabetical order
					
						let getEntities = [this.name],
							displayEntNames = "Entity list: ";

						for (var ge in npcs) {
							const index = parseInt(ge);
							getEntities[index] = npcs[index - 1].name;
						}

						getEntities.sort(function (a, b) {
							if (a.toLowerCase() < b.toLowerCase())
								return -1;
							if (a.toLowerCase() > b.toLowerCase())
								return 1;
							return 0;
						});

						for (var de in getEntities) {
							displayEntNames += (de > "0" ? ", " : "") + getEntities[de];
						}


						newEntry.appendChild(document.createTextNode(displayEntNames));
						this.textService.screenText.updateText(displayEntNames, this.h - this.chatBarObj.barH, this.textService.screenText.fontS * 2, "#fff");
						break;

					// invalid command
					default:
						let cmdErr = "Invalid command. See /help for a list of available commands.";

						newEntry.className = "error-text";
						newEntry.appendChild(document.createTextNode(cmdErr));
						this.textService.screenText.updateText(cmdErr, this.h - this.chatBarObj.barH, this.textService.screenText.fontS * 2, "#f44");
						break;
				}

			} else {
				this.msgTimer = this.msgMaxTime;
				newEntry.appendChild(document.createTextNode(this.name + ": " + this.lastMsg));
			}
			// add new line
			chatLog.insertBefore(newEntry, chatLog.childNodes[0]);

			// cut off oldest line if at max lines allowed
			if (chatLog.childNodes.length > this.chatBarObj.maxLines) {
				chatLog.removeChild(chatLog.getElementsByTagName("span")[this.chatBarObj.maxLines]);
			}
		}


	}; */

}