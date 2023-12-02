import { AuthService } from './../../services/auth.service';
import { GameHistoryService } from './../../services/game-history.service';
import { GameHistory } from './../../models/entities/gameHistory';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { User } from 'src/app/models/entities/user';
import { Messages } from 'src/app/constants/Messages';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { GameHistoryDto } from 'src/app/models/dto/gameHistoryDto';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, AfterViewInit {
  userSubject = new BehaviorSubject<User | null>(null);
  userGameHistoryDtosSubject = new BehaviorSubject<GameHistoryDto[]>([]);

  userGameHistoryDtos$ = this.userGameHistoryDtosSubject.asObservable();
  user$ = this.userSubject.asObservable();
  isVerif2FAVisible: boolean = false;

  gameHistoryDialogVisible: boolean = false;
  profileSettingsDialogVisible: boolean = false;
  constructor(
    private userService: UserService,
    private gameHistoryService: GameHistoryService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService) {

  }
  ngAfterViewInit(): void {
    this.user$.subscribe(response => {
      if (response) {
        this.isVerif2FAVisible = (this.authService.getCurrentUserId() == response.id);
      }
    })
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
            this.userSubject.next(response.data);
            this.getUserGameHistoryDtos(response.data.id);
          } else {
            throw new Error('User not found');
          }
        },
        error: (error) => {
          this.toastrService.error(Messages.error);
        }
      });
  }

  getUserGameHistoryDtos(userId: number) {
    this.gameHistoryService.getByUserIdGameHistoryDto(userId)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.userGameHistoryDtosSubject.next(response.data);
          }
        },
        error: (responseError) => {
          this.toastrService.error(Messages.error);
        }
      });
  }

  showGameHistoryDialog() {
    this.gameHistoryDialogVisible = true;
  }

  showProfileSettingDialog(){
    this.profileSettingsDialogVisible = true;
  }

  twoFA() {

  }
}
