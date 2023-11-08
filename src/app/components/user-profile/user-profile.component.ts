import { GameHistoryService } from './../../services/game-history.service';
import { GameHistory } from './../../models/entities/gameHistory';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { Component } from '@angular/core';
import { User } from 'src/app/models/entities/user';
import { Messages } from 'src/app/constants/Messages';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {


  user$ = new BehaviorSubject<User | null>(null);
  userGameHistories$ = new BehaviorSubject<GameHistory[]>([]);

  constructor(
    private userService: UserService,
    private gameHistoryService: GameHistoryService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private router: Router) {

  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params: any) => {
          const nickName = params.get('nickname');
          if (!nickName) {
            throw new Error('Nickname is required');
          }
          return this.userService.getByNickName(nickName);
        })
      )
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.user$.next(response.data);
            this.getUserGameHistories(response.data.id);
          } else {
            throw new Error('User not found');
          }
        },
        error: (error) => {
          this.toastrService.error(Messages.error);
        }
      });
  }

  getUserGameHistories(userId: number) {
    this.gameHistoryService.getByUserId(userId)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.userGameHistories$.next(response.data);
          }
        },
        error: (responseError) => {
          this.toastrService.error(Messages.error);
        }
      });
  }
}
