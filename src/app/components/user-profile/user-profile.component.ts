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
import { switchMap } from 'rxjs/operators';
import { GameHistoryDto } from 'src/app/models/dto/gameHistoryDto';
import { GameTotalScoreByUserDto } from 'src/app/models/dto/gameTotalScoreByUserDto';
import { GameTotalScoreService } from 'src/app/services/game-total-score.service';
import { GameTotalScore } from 'src/app/models/entities/gameTotalScore';
import { UserAchievementByAchievementDto } from 'src/app/models/dto/userAchievementByAchievementDto';
import { UserBlockService } from 'src/app/services/user-block.service';
import { UserBlock } from 'src/app/models/entities/userBlock';

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
	currentUserId: number;
	profileUserId: number;
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

	constructor(
		private userService: UserService,
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
		this.currentUserId = this.authService.getCurrentUserId();
		this.route.paramMap
			.pipe(
				switchMap((params: any) => {
					this.nickName = params.get('nickname');
					if (!this.nickName) {
						throw new Error('Nickname is required');
					}
					return this.userService.getByNickName(this.nickName);
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

	ngAfterViewInit(): void {
		this.user$.subscribe(response => {
			if (response) {
				this.profileUserId = Number(response.id);
				this.editProfileVisible = (this.currentUserId == response.id);
			}
		})
		this.getGameTotalScories();
		this.getAllUserAchievementByAchievementDtoWithUserId(this.currentUserId);
		this.getUserBlock();

		this.userBlock$.subscribe(response => {
			// if (response) {
			this.userBlock = response;
			// }
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

	showProfileSettingDialog() {
		// this.profileSettingsDialogVisible = true;
		this.router.navigate(['/user-edit-profile/', this.nickName])
	}

	getGameTotalScories() {
		this.gameTotalScoreService.getByNickName(this.nickName).subscribe(response => {
			if (response.success) {
				this.gameTotalScoriesSubject.next(response.data);
			}
		});
	}

	getAllUserAchievementByAchievementDtoWithUserId(userId: number) {
		this.userAchievementService.getAllUserAchievementByAchievementDtoWithUserId(userId).subscribe(response => {
			if (response.success) {
				this.userAchievementByAchievementDtoSubject.next(response.data);
			}
		})
	}

	userBlockDelete() {
		// Eğer userBlock yoksa, yeni bir engelleme ekleyin.
		if (!this.userBlock) {
			this.userBlockAdd();
			return;
		}
		// Var olan engellemeyi kaldır
		this.userBlockService.delete(this.userBlock.id).subscribe({
			next: (response) => {
				if (response.success) {
					this.toastrService.success(Messages.success);
					this.getUserBlock(); // Güncel engelleme durumunu yeniden al
				}
			},
			error: () => {
				// Hata yönetimi
				this.toastrService.error(Messages.error);
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
					this.getUserBlock(); // Engelleme başarılı ise, durumu güncelleyin
				}
			},
			error: () => {
				// Hata yönetimi
				this.toastrService.error(Messages.error);
			}
		});
	}

	getUserBlock() {
		this.userBlockService.getByBlockerIdBlockedId({
			id: 0,
			blockerId: Number(this.currentUserId),
			blockedId: Number(this.profileUserId),
			createdAt: new Date(),
			updateTime: new Date(),
			status: true
		}).subscribe(response => {
			// if (response.success) {
				this.userBlockSubject.next(response.data);
				this.cdr.detectChanges();
			// }
		})
	}
}
