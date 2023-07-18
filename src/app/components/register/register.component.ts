import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PrimeNGConfig } from 'primeng/api';
import { Messages } from 'src/app/constants/Messages';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  protected registerForm: FormGroup;
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
    this.registerForm = this.formBuilder.group({
      "email": ["", [Validators.required, Validators.email, Validators.minLength(3)]],
      "password": ["", [Validators.required, Validators.minLength(1)]],
      "password1": ["", [Validators.required, Validators.minLength(1)]],
      "firtName": ["", [Validators.required, Validators.minLength(1)]],
      "lastName": ["", [Validators.required, Validators.minLength(1)]],
      "nickName": ["", [Validators.required, Validators.minLength(1)]],
    })
  }
  login() {
      let registerForm = Object.assign({}, this.registerForm.value);
      this.authService.register(registerForm).subscribe(response => {
        let token:string = String(response.data.token);
        localStorage.setItem("token", token);
        if(response.data && token.length > 0 && localStorage.getItem("token")){
          this.toastrService.info(Messages.success);
          this.router.navigate(['/view'])
        }
      }, responseError => {
        // if (responseError.error == "User Not Found")
        //   this.toastrService.info(Messages.userNotFound)
        this.router.navigate(['/login'])
      });
  }
  onSubmit(): void {
    if (!this.registerForm.valid)
      return;
    this.login();
  }
  checkRequiredForDisable():boolean
  {
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
}
