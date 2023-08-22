import { CmdObj } from "./CmdObj";

export const cmd = [
	new CmdObj ("clear", "", "clear chat"),
	new CmdObj ("help", "", "get help menu"),
	new CmdObj ("entityinfo", "<name>", "get details of entity"),
	new CmdObj ("modentity", "<name> <newname> [gender] [skin] [speed] [level]", "modify entity"),
	new CmdObj ("npc", "<add|del> <name> [gender] [skin] [speed] [level] [<x> <y>]", "add/delete NPC"),
	new CmdObj ("tp", "<name> <x> <y> or <name> <targetname>", "teleport entity to new location"),
	new CmdObj ("who", "", "get list of all entities")
  ];