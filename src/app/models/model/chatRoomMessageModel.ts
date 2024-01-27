import { GameInvateModel } from "./gameInvateModel";

export interface ChatRoomMessageModel {
    text: string;
    sender: string;
    date: Date;
    imageUrl: string;
    gameInvateModel: GameInvateModel;
    isInterpreted: boolean;
}