import { BehaviorSubject, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { GameTotalScoreService } from './../../services/game-total-score.service';
import { Component, OnInit } from '@angular/core';
import { GameTotalScore } from 'src/app/models/entities/gameTotalScore';
import { Messages } from 'src/app/constants/Messages';
import { GameTotalScoreByUserDto } from 'src/app/models/dto/gameTotalScoreByUserDto';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  gameTotalScoreByUserDto: GameTotalScoreByUserDto[];
  gameTotalScoreByUserDtoSubject = new BehaviorSubject<GameTotalScoreByUserDto[] | null>(null);
  gameTotalScoreByUserDto$ = this.gameTotalScoreByUserDtoSubject.asObservable();

  constructor(
    private gameTotalScoreService: GameTotalScoreService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.getGameTotalScoreByUserDto();
  }

  getGameTotalScoreByUserDto() {
    this.gameTotalScoreService.getWithUserDtos().subscribe(response => {
      if (response.success) {
        this.gameTotalScoreByUserDtoSubject.next(response.data);
      }
    });
  }
}
