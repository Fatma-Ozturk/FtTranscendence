import { UserService } from './../../services/user.service';
import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { Messages } from 'src/app/constants/Messages';
import { User } from 'src/app/models/entities/user';
import { JwtControllerService } from 'src/app/services/jwt-controller.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserInfoService } from 'src/app/services/user-info.service';
import { UserInfo } from 'src/app/models/entities/userInfo';
import { AchievementRuleService } from 'src/app/services/achievement-rule.service';
import { UserTwoFAService } from 'src/app/services/user-two-fa.service';
import { UserTwoFA } from 'src/app/models/entities/userTwoFA';
import { catchError, of, tap } from 'rxjs';

@Component({
	selector: 'app-redirection-auth-google',
	templateUrl: './redirection-auth-google.component.html',
	styleUrls: ['./redirection-auth-google.component.css'],
	providers: [MessageService]
})
export class RedirectionAuthGoogleComponent {
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

	getUserTwoFA() {
		this.userTwoFAService.getByUserId(this.authService.getCurrentUserId()).pipe(
			tap((value: any) => {
				if (value && value.success && value.data) {
					this.userTwoFA = value.data;
					this.userTwoFA.isVerify = false;
					this.updateUserTwoFA(this.userTwoFA);
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
				return of(null);
			})
		).subscribe();
	}
	checkAchievement(achievementName: string) {
		let currentUserId = this.authService.getCurrentUserId();
		return this.achievementRuleService.checkAchievement(currentUserId, achievementName);
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
