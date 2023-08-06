import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PrimeNGConfig } from 'primeng/api';
import { Messages } from 'src/app/constants/Messages';
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
        let token:string = String(response.data.token);
        localStorage.setItem("token", token);
        if(response.data && token.length > 0 && localStorage.getItem("token")){
          this.router.navigate(['/view'])
        }
      }, responseError => {
        console.log("responseError.data.message " + JSON.stringify(responseError.error.message));
        
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
  checkRequiredForDisable():boolean
  {
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
  Login42(): void
  {
    console.log("42Login");
    location.href = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-b573ae099adcf6f927bb38d2d0612e247c9d23c772a292d91b49046b9ac645fd&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth42%2Fregister&response_type=code"
  }
}
