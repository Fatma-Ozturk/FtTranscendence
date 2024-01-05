import { switchMap } from 'rxjs/operators';
import { AchievementRuleService } from './../../services/achievement-rule.service';
import { UserInfoService } from './../../services/user-info.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PrimeNGConfig } from 'primeng/api';
import { Messages } from 'src/app/constants/Messages';
import { AuthService } from 'src/app/services/auth.service';
import { UserInfo } from 'src/app/models/entities/userInfo';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  avatarUrl: string | null = null;
  protected registerForm: FormGroup;
  formErrors: { [key: string]: string } = {};

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private userInfoService: UserInfoService,
    private achievementRuleService: AchievementRuleService,
    private toastrService: ToastrService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private primengConfig: PrimeNGConfig) { }

  ngOnInit(): void {
    // this.primengConfig.ripple = true;
    this.createRegisterFrom();
  }
  createRegisterFrom() {
    this.registerForm = this.formBuilder.group({
      "email": ["", [Validators.required, Validators.email, Validators.minLength(3)]],
      "nickName": ["", [Validators.required, Validators.minLength(3)]],
      "password": ["", [Validators.required, Validators.minLength(1)]],
      "password1": ["", [Validators.required, Validators.minLength(1)]],
    })
  }
  register() {
    // let registerForm = Object.assign({}, this.registerForm.value);
    // this.authService.register(registerForm).subscribe(response => {
    //   let token: string = String(response.data.token);
    //   localStorage.setItem("token", token);
    //   if (response.data && token.length > 0 && localStorage.getItem("token")) {
    //     this.updateUserInfo();
    //     this.router.navigate(['/view']);
    //     this.toastrService.info(Messages.success);
    //   }
    // }, responseError => {
    //   if (responseError.error) {
    //     if (responseError.error.message == "User Not Found")
    //       this.toastrService.info(Messages.userNotFound)
    //     if (responseError.error.message == "User Already Exists")
    //       this.toastrService.info(Messages.userAlreadyExists)
    //   }
    // });

    let registerForm = Object.assign({}, this.registerForm.value);
    this.authService.register(registerForm).pipe(
      switchMap((response: any): any => {
        let token: string = String(response.data.token);
        localStorage.setItem("token", token);
        if (response.data && token.length > 0 && localStorage.getItem("token")) {
          return this.updateUserInfo();
        }
      }), switchMap((): any => this.checkAchievement('sign')),
    ).subscribe({
      next: (response: any) => {
        if (this.authService.isActive()){
          this.router.navigate(['/view']);
          this.toastrService.info(Messages.success);
        }
      },
      error: (responseError: any) => {
        if (responseError.error) {
          if (responseError.error.message == "User Not Found")
            this.toastrService.info(Messages.userNotFound);
          if (responseError.error.message == "User Already Exists")
            this.toastrService.info(Messages.userAlreadyExists);
        }
      }
    });
  }
  onSubmit(): void {
    if (!this.registerForm.valid)
      return;
    this.register();
  }
  checkRequiredForDisable(): boolean {
    return (this.registerForm.get("email").hasError('required') || this.registerForm.get("password").hasError('required'))
  }
  isFieldInvalid(fieldName: string): boolean {
    const control = this.registerForm.get(fieldName);
    return control.invalid && (control.dirty || control.touched);
  }
  getErrorMessage(fieldName: string): string {
    const control = this.registerForm.get(fieldName);

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

  updateUserInfo() {
    let currentUserId = this.authService.getCurrentUserId();
    let userInfo: UserInfo = {
      id: 0,
      userId: currentUserId,
      loginDate: new Date(),
      profileCheck: true,
      profileImagePath: "",
      profileText: "",
      gender: false,
      birthdayDate: new Date()
    };
    return this.userInfoService.add(userInfo);
  }

  checkAchievement(achievementName: string) {
    let currentUserId = this.authService.getCurrentUserId();
    return this.achievementRuleService.checkAchievement(currentUserId, achievementName);
  }
}
