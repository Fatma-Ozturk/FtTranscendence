import { GameService } from './../../services/game.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

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
  constructor(private gameService: GameService, private router:Router) {

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
        else if (response.message === "Matchmaking Join"){
          this.progressBarDivVisible = false;
          this.gameText = "Oyuncu Bulundu..."
        }
        else if (response.message === "Matchmaking Finish"){
          this.progressBarDivVisible = false;
          this.gameText = "Yönlendiriliyor..."
          this.gameService.getGameRoomId().subscribe((response: any)=>{
            if (response != null && response !== undefined){
              setTimeout(() => {
                const queryParams = { 'room-id': response.message};
                this.router.navigate(['/game'], {queryParams});
            }, 1000);
            }
        })
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
