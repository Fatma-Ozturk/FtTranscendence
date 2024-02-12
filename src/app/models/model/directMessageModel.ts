import { GameInvateModel } from "./gameInvateModel";

export interface DirectMessageModel {
    text: string;
    sender: string;
    date: Date;
    imageUrl: string;
    gameInvateModel: GameInvateModel;
    isInterpreted: boolean;
}
