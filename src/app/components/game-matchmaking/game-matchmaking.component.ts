import { GameService } from './../../services/game.service';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-game-matchmaking',
  templateUrl: './game-matchmaking.component.html',
  styleUrls: ['./game-matchmaking.component.css']
})
export class GameMatchmakingComponent {
  @ViewChild('gameTextDiv', { static: true })
  gameTextDivRef: ElementRef<HTMLDivElement>;

  @ViewChild('processDiv', { static: true })
  processDivRef: ElementRef<HTMLDivElement>;

  progressBarDivVisible: boolean;
  gameTextDivVisible: boolean
  constructor(private gameService: GameService) {

  }

  ngOnInit() {
    this.progressBarDivVisible = false;
    this.gameTextDivVisible = true;
  }

  matchGame(){
    this.gameService.sendMatchmaking('');
  }
}
