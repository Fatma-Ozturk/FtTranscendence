import { GoogleTwoFASettingsModel } from './../../models/model/googleTwoFASettingsModel';
import { UserTwoFAService } from 'src/app/services/user-two-fa.service';
import { UserTwoFA } from './../../models/entities/userTwoFA';
import { TwoFAService } from 'src/app/services/two-fa.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Messages } from 'src/app/constants/Messages';

@Component({
	selector: 'app-user-two-fa',
	templateUrl: './user-two-fa.component.html',
	styleUrls: ['./user-two-fa.component.css']
})
export class UserTwoFAComponent implements OnInit {
	protected twoFAForm: FormGroup;
	currentUserId: number;
	userTwoFA: UserTwoFA;
	formErrors: { [key: string]: string } = {};

	constructor(private formBuilder: FormBuilder,
		private authService: AuthService,
		private userService: UserService,
		private toastrService: ToastrService,
		private router: Router,
		private twoFAService: TwoFAService,
		private userTwoFAService: UserTwoFAService) { }
	ngOnInit(): void {
		this.currentUserId = this.authService.getCurrentUserId();
	}

	createTwoFAFrom() {
		this.twoFAForm = this.formBuilder.group({
		  "token": ["", [Validators.required, Validators.minLength(3)]],
		})
	}
	getByUserIdTwoFA() {
		this.userTwoFAService.getByUserId(this.currentUserId).subscribe({
			next: (value: any) => {
				if (value && value.success) {
					this.userTwoFA = value.data;
				}
			},
			error: (error: any) => {
				this.toastrService.error("Hata oluştu");
			}
		});
	}
	verifyTwoFAOtp(settings: any, token: string) {
		this.twoFAService.verify(settings, token).subscribe({
			next: (value)=> {

				this.toastrService.success(Messages.success);
			},
			error: (err) => {

			},
		});
	}
	//token'ı localstrogae'den sakla
	//guard ile router path hiyerarşi token'ı ver ve (this.twoFAService.verify)'a göre  erişim kontrolü yap
	onSubmit(): void {
		if (!this.twoFAForm.valid)
			return;
		let settings;
		let twoFAFormValue = Object.assign({}, this.twoFAForm.value);
		settings = {};
		if (this.userTwoFA.twoFAType == 1){
			settings = this.createGoogleTwoFASettings();
		}
		this.verifyTwoFAOtp(settings.secretBase32, twoFAFormValue.token);
	}
	createGoogleTwoFASettings(){
		let googleTwoFASettingsModel:GoogleTwoFASettingsModel =  JSON.parse(this.userTwoFA.settings);
		return googleTwoFASettingsModel;
	}
	checkRequiredForDisable(): boolean {
		return (this.twoFAForm.get("token").hasError('required'))
	}

	isFieldInvalid(fieldName: string): boolean {
		const control = this.twoFAForm.get(fieldName);
		return control.invalid && (control.dirty || control.touched);
	}
	getErrorMessage(fieldName: string): string {
		const control = this.twoFAForm.get(fieldName);

		if (control.hasError('required')) {
			return 'Bu alan gereklidir.';
		}

		if (control.hasError('minlength')) {
			const minLength = control.errors?.['minlength'].requiredLength;
			return `Bu alan en az ${minLength} karakter uzunluğunda olmalıdır.`;
		}
		return '';
	}
}
