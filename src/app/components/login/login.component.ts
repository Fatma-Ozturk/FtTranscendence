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

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  protected loginForm: FormGroup;
  formErrors: { [key: string]: string } = {};

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService:UserService,
    private toastrService: ToastrService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private primengConfig: PrimeNGConfig) { }

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
    let loginModel = Object.assign({}, this.loginForm.value);
    this.authService.login(loginModel).subscribe(response => {
      let token: string = String(response.data.token);
      localStorage.setItem("token", token);
      if (response.data && token.length > 0 && localStorage.getItem("token")) {
          this.router.navigate(['/view'])
          this.toastrService.info(Messages.success);
      }
    }, responseError => {
      if (responseError.error.message == "User Not Found")
        this.toastrService.info(Messages.userNotFound)
      if (responseError.error.message == "Password Error")
        this.toastrService.info(Messages.passwordError)
      this.router.navigate(['/login'])
    });
  }
  onSubmit(): void {
    if (!this.loginForm.valid)
      return;
    this.login();
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
