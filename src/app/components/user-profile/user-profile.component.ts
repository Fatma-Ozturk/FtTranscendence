import { UserInfoService } from 'src/app/services/user-info.service';
import { UserAchievementService } from './../../services/user-achievement.service';
import { UserAchievement } from './../../models/entities/userAchievement';
import { Achievement } from './../../models/entities/achievement';
import { AchievementRuleService } from './../../services/achievement-rule.service';
import { AuthService } from './../../services/auth.service';
import { GameHistoryService } from './../../services/game-history.service';
import { GameHistory } from './../../models/entities/gameHistory';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { User } from 'src/app/models/entities/user';
import { Messages } from 'src/app/constants/Messages';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { GameHistoryDto } from 'src/app/models/dto/gameHistoryDto';
import { GameTotalScoreByUserDto } from 'src/app/models/dto/gameTotalScoreByUserDto';
import { GameTotalScoreService } from 'src/app/services/game-total-score.service';
import { GameTotalScore } from 'src/app/models/entities/gameTotalScore';
import { UserAchievementByAchievementDto } from 'src/app/models/dto/userAchievementByAchievementDto';
import { UserBlockService } from 'src/app/services/user-block.service';
import { UserBlock } from 'src/app/models/entities/userBlock';
import { UserInfo } from 'src/app/models/entities/userInfo';

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, AfterViewInit {
	userGameHistoryDtosSubject = new BehaviorSubject<GameHistoryDto[]>([]);
	userGameHistoryDtos$ = this.userGameHistoryDtosSubject.asObservable();

	userSubject = new BehaviorSubject<User | null>(null);
	user$ = this.userSubject.asObservable();

	userInfoSubject = new BehaviorSubject<UserInfo | null>(null);
	userInfo$ = this.userInfoSubject.asObservable();
	profileUrl: string = "assets/player.png";

	currentUserId: number = 0;
	profileUserId: number = 0;
	nickName: string = "";
	editProfileVisible: boolean = false;

	gameHistoryDialogVisible: boolean = false;

	gameTotalScoriesSubject = new BehaviorSubject<GameTotalScore | null>(null);
	gameTotalScories$ = this.gameTotalScoriesSubject.asObservable();

	userAchievementByAchievementDtoSubject = new BehaviorSubject<UserAchievementByAchievementDto[] | null>(null);
	userAchievementByAchievementDtos$ = this.userAchievementByAchievementDtoSubject.asObservable();

	userBlockSubject = new BehaviorSubject<UserBlock | null>(null);
	userBlock$ = this.userBlockSubject.asObservable();
	userBlock: UserBlock;
	isUserBlock: boolean = false;

	constructor(
		private userService: UserService,
		private userInfoService: UserInfoService,
		private gameHistoryService: GameHistoryService,
		private gameTotalScoreService: GameTotalScoreService,
		private achievementRuleService: AchievementRuleService,
		private userAchievementService: UserAchievementService,
		private userBlockService: UserBlockService,
		private toastrService: ToastrService,
		private route: ActivatedRoute,
		private router: Router,
		private authService: AuthService,
		private cdr: ChangeDetectorRef) {

	}

	ngOnInit(): void {
		this.profileUrl = "assets/player.png";
		this.currentUserId = this.authService.getCurrentUserId();
		this.route.paramMap
			.pipe(
				switchMap((params: any) => {
					this.nickName = params.get('nickname');
					if (!this.nickName) {
						this.toastrService.error(Messages.error);
						this.router.navigate(['/']);
					}
					return this.getGameTotalScories(this.nickName);
				}),
				switchMap((params: any) => {
					this.gameTotalScoriesSubject.next(params.data);
					return this.userInfoService.getByNickName(this.nickName);
				}),
				switchMap((params: any) => {
					this.profileUrl = this.userInfoService.getProfileImage(params.data.profileImagePath);
					return this.userService.getByNickName(this.nickName);
				})
			)
			.subscribe({
				next: (response: any) => {
					if (response.success) {
						this.profileUserId = Number(response.data.id);
						this.editProfileVisible = (this.currentUserId == response.data.id);
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

	ngAfterViewInit(): void {
		this.user$.subscribe(response => {
		});
		this.getAllUserAchievementByAchievementDtoWithUserId(this.currentUserId);
		this.userBlock$.subscribe(response => {
			this.userBlock = response;
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
					// this.toastrService.error(Messages.error);
				}
			});
	}

	showGameHistoryDialog() {
		this.gameHistoryDialogVisible = true;
	}

	showProfileSettingDialog() {
		this.router.navigate(['/user-edit-profile/', this.nickName])
	}

	getGameTotalScories(nickName: string) {
		return this.gameTotalScoreService.getByNickName(nickName);
	}

	getAllUserAchievementByAchievementDtoWithUserId(userId: number) {
		this.userAchievementService.getAllUserAchievementByAchievementDtoWithUserId(userId).subscribe(response => {
			if (response.success) {
				this.userAchievementByAchievementDtoSubject.next(response.data);
			}
		})
	}

	userBlockDelete() {
		if (!this.isUserBlock) {
			this.userBlockAdd();
			return;
		}
		this.userBlockService.delete(this.userBlock.id).subscribe({
			next: (response) => {
				if (response.success) {
					this.toastrService.success(Messages.success);
					this.getUserBlock();
				}
			},
			error: () => {
				// this.toastrService.error(Messages.error);
			}
		});
	}

	userBlockAdd() {
		let userBlock: UserBlock = {
			id: 0,
			blockerId: this.currentUserId,
			blockedId: this.profileUserId,
			createdAt: new Date(),
			updateTime: null,
			status: true,
		};
		this.userBlockService.add(userBlock).subscribe({
			next: (response) => {
				if (response.success) {
					this.toastrService.success(Messages.success);
					this.getUserBlock();
				}
			},
			error: () => {
				// this.toastrService.error(Messages.error);
			}
		});
	}

	getUserBlock() {
		const userBlock = {
			id: 0,
			blockerId: Number(this.currentUserId),
			blockedId: Number(this.profileUserId),
			createdAt: new Date(),
			updateTime: new Date(),
			status: true
		}
		this.userBlockService.getByBlockerIdBlockedId(userBlock).subscribe({
			next: (response) => {
				if (response.data == null || response.data === undefined) {
					this.isUserBlock = false;
				} else {
					this.userBlockSubject.next(response.data);
					this.isUserBlock = true;
				}
				this.cdr.detectChanges();
			},
			error: () => {
				this.isUserBlock = false;
				this.cdr.detectChanges();
			}
		})
	}

	getUserInfoByNickName(nickName: string) {
		this.userInfoService.getByNickName(nickName).subscribe({
			next: (response) => {
				if (response.success) {
					this.userInfoSubject.next(response.data);
				}
			},
			error: () => {
				// this.toastrService.error(Messages.error);
			}
		});
	}
}
