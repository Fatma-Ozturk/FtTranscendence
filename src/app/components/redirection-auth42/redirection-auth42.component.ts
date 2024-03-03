import { UserTwoFA } from './../../models/entities/userTwoFA';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { Messages } from 'src/app/constants/Messages';
import { User } from 'src/app/models/entities/user';
import { UserInfo } from 'src/app/models/entities/userInfo';
import { AchievementRuleService } from 'src/app/services/achievement-rule.service';
import { AuthService } from 'src/app/services/auth.service';
import { JwtControllerService } from 'src/app/services/jwt-controller.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserInfoService } from 'src/app/services/user-info.service';
import { UserTwoFAService } from 'src/app/services/user-two-fa.service';
import { UserService } from 'src/app/services/user.service';

@Component({
	selector: 'app-redirection-auth42',
	templateUrl: './redirection-auth42.component.html',
	styleUrls: ['./redirection-auth42.component.css'],
	providers: [MessageService]
})
export class RedirectionAuth42Component {
	private token: string = "";
	private success: string = "";
	private message: string = "";
	private userTwoFA: UserTwoFA;
	constructor(private route: ActivatedRoute,
		private router: Router,
		private jwtControllerService: JwtControllerService,
		private localStorageService: LocalStorageService,
		private toastrService: ToastrService,
		private authService: AuthService,
		private userInfoService: UserInfoService,
		private achievementRuleService: AchievementRuleService,
		private userTwoFAService: UserTwoFAService) {

	}

	ngOnInit(): void {
		this.token = this.route.snapshot.paramMap.get('token');
		this.success = this.route.snapshot.paramMap.get('success');
		this.message = this.route.snapshot.paramMap.get('message');
		if (this.success === 'true') {
			if (this.jwtControllerService.isActive(this.token)) {
				this.localStorageService.saveItem("token", this.token);
				this.checkAchievement('sign').subscribe({
					next: (value: any) => {
						if (value) {
							this.toastrService.success(Messages.newAchievement);
						}
					},
					error: (error: any) => {
						// this.toastrService.error(Messages.error);
					}
				});
				this.getUserTwoFA();
			}
		} else if (this.success === 'false') {
			// Hata mesajları ve yönlendirme
			this.handleError(this.message);
		}
	}

	handleError(message: string) {
		if (message === 'User Already Exists') {
			this.toastrService.error(Messages.userAlreadyExists);
		} else if (message === 'User Not Found') {
			this.toastrService.error(Messages.userNotFound);
		} else if (message === 'Password Error') {
			this.toastrService.error(Messages.passwordError);
		}
		this.router.navigate(['/main']);
	}

	checkAchievement(achievementName: string) {
		let currentUserId = this.authService.getCurrentUserId();
		return this.achievementRuleService.checkAchievement(currentUserId, achievementName);
	}

	getUserTwoFA() {
		this.userTwoFAService.getByUserId(this.authService.getCurrentUserId()).pipe(
			tap((value: any) => {
				if (value && value.success && value.data) {
					this.userTwoFA = value.data;
					this.userTwoFA.isVerify = false;
					this.updateUserTwoFA(this.userTwoFA);
					// isTwoFA durumuna göre yönlendirme
					if (this.userTwoFA.isTwoFA) {
						this.router.navigate(['/user-two-fa']);
					} else {
						this.router.navigate(['/view']);
						this.toastrService.success(Messages.success);
					}
				}else{
					this.router.navigate(['/view']);
				}
			}),
			catchError((error) => {
				this.toastrService.error(Messages.error);
				// Hata durumunda uygun bir Observable döndür
				return of(null);
			})
		).subscribe();
	}
	updateUserTwoFA(userTwoFA: UserTwoFA) {
		this.userTwoFAService.update(userTwoFA).subscribe({
			next: (value: any) => {
			},
			error: (error: any) => {
				this.toastrService.error(Messages.error);
			}
		});
	}
}
