export interface GameRoomSocket {
  userHostId: number;
  userGuestId: number;
  userHostScore: number;
  userGuestScore: number;
  resultNameId: number;
  startTime: Date;
  timer: number;
  speed: number;
}
