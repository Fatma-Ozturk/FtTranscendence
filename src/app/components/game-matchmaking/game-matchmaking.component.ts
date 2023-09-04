import { GameService } from './../../services/game.service';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-game-matchmaking',
  templateUrl: './game-matchmaking.component.html',
  styleUrls: ['./game-matchmaking.component.css']
})
export class GameMatchmakingComponent {
  gameText:string;

  @ViewChild('processDiv', { static: true })
  processDivRef: ElementRef<HTMLDivElement>;

  progressBarDivVisible: boolean;
  gameTextDivVisible: boolean
  constructor(private gameService: GameService) {

  }

  ngOnInit() {
    this.progressBarDivVisible = false;
    this.gameTextDivVisible = true;
    this.gameText = "Oyuna katıl";
  }

  ngDoCheck(){
    this.gameService.getNewMatchmakingResponse().subscribe(
      (response: any) => {
        console.log("response" + JSON.stringify(response));
        if (response.message === "Matchmaking Search"){
          this.progressBarDivVisible = true;
          this.gameText = "Oyuncu Aranıyor..."
        }
      },
      (error) => {
        console.error('Error reading matchmaking response:', error);
      }
    );
  }

  matchGame(){
    this.gameService.connectSocket();
    console.log("this.gameService.getNewMatchmakingResponse() " + JSON.stringify(this.gameService.getNewMatchmakingResponse));
    this.gameService.sendMatchmaking('');
  }
}
