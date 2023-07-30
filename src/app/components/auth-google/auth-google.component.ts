import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-google',
  templateUrl: './auth-google.component.html',
  styleUrls: ['./auth-google.component.css']
})
export class AuthGoogleComponent {
  @Input() isLoginOrRegister:boolean;

  LoginGoogle(): void
  {
    location.href = "https://accounts.google.com/o/oauth2/v2/auth?client_id=14263514491-idgt0ri47deboi1o5ssacbiqicsr9dn9.apps.googleusercontent.com&response_type=code&scope=email%20profile&include_granted_scopes=true&redirect_uri=http://localhost:3000/api/auth-google/login"
  }

  RegisterGoogle(): void
  {
    location.href = "https://accounts.google.com/o/oauth2/v2/auth?client_id=14263514491-idgt0ri47deboi1o5ssacbiqicsr9dn9.apps.googleusercontent.com&response_type=code&scope=email%20profile&include_granted_scopes=true&redirect_uri=http://localhost:3000/api/auth-google/register"
  }
}
