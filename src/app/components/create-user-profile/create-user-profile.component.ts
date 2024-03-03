import { LoginModel } from './../../models/model/loginModel';
import { UserService } from './../../services/user.service';
import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/entities/user';
import { Messages } from 'src/app/constants/Messages';

@Component({
  selector: 'app-create-user-profile',
  templateUrl: './create-user-profile.component.html',
  styleUrls: ['./create-user-profile.component.css']
})
export class CreateUserProfileComponent {
  protected createProfileForm: FormGroup;
  formErrors: { [key: string]: string } = {};

  constructor(private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private userService: UserService) { }

  ngOnInit(): void {
    // this.primengConfig.ripple = true;
    this.createProfileFrom();
  }
  createProfileFrom() {
    this.createProfileForm = this.formBuilder.group({
      "nickName": ["", [Validators.required, Validators.minLength(1)]],
      "firstName": ["", [Validators.required, Validators.minLength(3)]],
      "lastName": ["", [Validators.required, Validators.minLength(1)]]
    })
  }
  updateUser() {
    let userProfileModel = Object.assign({}, this.createProfileForm.value);
    let user: User;

    let userMail = this.authService.getCurrentMail();

    this.userService.getByMail(userMail).subscribe(response => {
      user = response.data;
      user.nickName = userProfileModel.nickName;
      user.firstName = userProfileModel.firstName;
      user.lastName = userProfileModel.lastName;
      user.status = true;
    }, responseError => {
      if (responseError.error.message == "User Not Found")
        this.toastrService.info(Messages.userNotFound)
    });

    this.userService.update(user).subscribe(response => {
      if (response.success){
        localStorage.removeItem("token");
      }
      if (!response.success){
        this.toastrService.info(Messages.error);
      }
    }, responseError => {
      if (!responseError.success){
        this.toastrService.info(Messages.error);
      }
    });
  }
  onSubmit(): void {
    if (!this.createProfileForm.valid)
      return;
    this.updateUser();
  }
  checkRequiredForDisable(): boolean {
    return (this.createProfileForm.get("nickName").hasError('required'))
  }
  isFieldInvalid(fieldName: string): boolean {
    const control = this.createProfileForm.get(fieldName);
    return control.invalid && (control.dirty || control.touched);
  }
  getErrorMessage(fieldName: string): string {
    const control = this.createProfileForm.get(fieldName);

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
