import { UserTwoFAService } from './../../services/user-two-fa.service';
import { UserTwoFA } from './../../models/entities/userTwoFA';
import { UserService } from 'src/app/services/user.service';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PrimeNGConfig } from 'primeng/api';
import { Messages } from 'src/app/constants/Messages';
import { User } from 'src/app/models/entities/user';
import { AuthService } from 'src/app/services/auth.service';
import { AchievementRuleService } from 'src/app/services/achievement-rule.service';
import { of, switchMap } from 'rxjs';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent {
	protected loginForm: FormGroup;
	formErrors: { [key: string]: string } = {};

	userTwoFA: UserTwoFA;

	constructor(private formBuilder: FormBuilder,
		private authService: AuthService,
		private userService: UserService,
		private toastrService: ToastrService,
		private router: Router,
		private achievementRuleService: AchievementRuleService,
		private sanitizer: DomSanitizer,
		private primengConfig: PrimeNGConfig,
		private userTwoFAService: UserTwoFAService) { }

	ngOnInit(): void {
		// this.primengConfig.ripple = true;
		this.createLoginFrom();
	}
	createLoginFrom() {
		this.loginForm = this.formBuilder.group({
			"email": ["", [Validators.required, Validators.email, Validators.minLength(3)]],
			"password": ["", [Validators.required, Validators.minLength(1)]]
		})
	}
	login() {
		const loginModel = Object.assign({}, this.loginForm.value);
		this.authService.login(loginModel).pipe(
			switchMap((response: any) => {
				const token: string = String(response.data.token);
				localStorage.setItem("token", token);
				if (response.data && token.length > 0) {
					return this.getUserTwoFA();
				} else {
					// Token alınamadıysa akışı sonlandır
					return of(null);
				}
			})
		).subscribe({
			next: (userTwoFAResponse: any) => {
				this.handleLoginSuccess(userTwoFAResponse);
			},
			error: (error: any) => {
				this.handleLoginError(error);
			}
		});
	}

	handleLoginSuccess(userTwoFAResponse: any) {
		if (userTwoFAResponse && userTwoFAResponse.success) {
			this.userTwoFA = userTwoFAResponse.data;
			if (!userTwoFAResponse.data && userTwoFAResponse.data != null){
				this.userTwoFA.isVerify = false;
				this.updateUserTwoFA(this.userTwoFA)
				this.toastrService.info(Messages.success);
				if (this.userTwoFA !== undefined && this.userTwoFA !== null && this.userTwoFA.isTwoFA === true) {
					this.router.navigate(['/user-two-fa']);
				} else {
					this.router.navigate(['/view']);
				}
			}else{
				this.router.navigate(['/view']);
			}
		} else {
			// Eğer getUserTwoFA'dan geçerli bir yanıt alınamadıysa
			this.router.navigate(['/view']);
			this.toastrService.info(Messages.success);
		}
	}

	handleLoginError(error: any) {
		if (error.error.message === "User Not Found") {
			this.toastrService.info(Messages.userNotFound);
		} else if (error.error.message === "Password Error") {
			this.toastrService.info(Messages.passwordError);
		} else {
			this.toastrService.error(Messages.error); // Genel hata mesajı
		}
		this.router.navigate(['/login']);
	}

	onSubmit(): void {
		if (!this.loginForm.valid)
			return;
		this.login();
	}
	getUserTwoFA() {
		return this.userTwoFAService.getByUserId(this.authService.getCurrentUserId());
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

	checkRequiredForDisable(): boolean {
		return (this.loginForm.get("email").hasError('required') || this.loginForm.get("password").hasError('required'))
	}
	isFieldInvalid(fieldName: string): boolean {
		const control = this.loginForm.get(fieldName);
		return control.invalid && (control.dirty || control.touched);
	}
	getErrorMessage(fieldName: string): string {
		const control = this.loginForm.get(fieldName);

		if (control.hasError('required')) {
			return 'Bu alan gereklidir.';
		}

		if (control.hasError('minlength')) {
			const minLength = control.errors?.['minlength'].requiredLength;
			return `Bu alan en az ${minLength} karakter uzunluğunda olmalıdır.`;
		}

		if (control.hasError('email')) {
			return 'Geçersiz e-posta adresi.';
		}

		return '';
	}
}
