import { Injectable } from '@angular/core';
import { JwtControllerService } from './jwt-controller.service';
import { LoginModel } from '../models/model/loginModel';
import { SingleResponseModel } from '../models/singleResponseModel';
import { TokenModel } from '../models/model/tokenModel';
import { RegisterModel } from '../models/model/registerModel';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  name = "auth";
  currentUserId: number = 0;
  private data = new BehaviorSubject<boolean>(false)
  isAuth = this.data.asObservable()
  private data1 = new BehaviorSubject<string>(null);
  roleName = this.data1.asObservable()
  constructor(private httpClient: HttpClient, private jwtControllerService: JwtControllerService) {

  }
  login(loginModel: LoginModel) {
    return this.httpClient.post<SingleResponseModel<TokenModel>>(environment.appurl + "auth/login", loginModel)
  }
  register(registerModel: RegisterModel) {
    return this.httpClient.post<SingleResponseModel<TokenModel>>(environment.appurl + "auth/register", registerModel)
  }
  // passwordChange(registerModel: RegisterModel) {
  //   return this.httpClient.post<SingleResponseModel<TokenModel>>(environment.appurl + "auth/passwordchange", registerModel)
  // }

  isAuthenticadet() {
    if (localStorage.getItem("token")) {
      this.data.next(true)
      return true;
    } else {
      this.data.next(false)
      return (false);
    }
  }
  getCurrentMail(): string {
    let token: string = localStorage.getItem("token");
    if (token) {
      let decoded = this.jwtControllerService.decodeToken(token);
      let nameClaim = decoded.claims.find((claim: { name: string; }) => claim.name === "email");
      if (nameClaim) {
        return nameClaim.value;
      }
    }
    return null;
  }
  getCurrentFullName(): string {
    let token: string = localStorage.getItem("token");
    if (token) {
      let decoded = this.jwtControllerService.decodeToken(token);
      let nameClaim = decoded.claims.find((claim: { name: string; }) => claim.name === "name");
      if (nameClaim) {
        return nameClaim.value;
      }
    }
    return null;
  }
  getCurrentNickName(): string {
    let token: string = localStorage.getItem("token");
    if (token) {
      let decoded = this.jwtControllerService.decodeToken(token);
      let nameClaim = decoded.claims.find((claim: { name: string; }) => claim.name === "nickName");
      if (nameClaim) {
        return nameClaim.value;
      }
    }
    return null;
  }
  getCurrentUserId(): number {
    let token: string = localStorage.getItem("token");
    if (token) {
      let decoded = this.jwtControllerService.decodeToken(token);
      let nameClaim = decoded.claims.find((claim: { name: string; }) => claim.name === "nameIdentifier");
      if (nameClaim) {
        return nameClaim.value;
      }
    }
    return null;
  }
  getCurrentIsVerified(): boolean {
    let token: string = localStorage.getItem("token");
    if (token) {
      let decoded = this.jwtControllerService.decodeToken(token);
      let nameClaim = decoded.claims.find((claim: { name: string; }) => claim.name === "isVerified");
      if (nameClaim) {
        return nameClaim.value === "true" ? true : false;
      }
    }
    return false;
  }
  getCurrentRole():string{
    let token: string = localStorage.getItem("token")
    if (token) {
      let decoded = this.jwtControllerService.decodeToken(token)
      let role = Object.keys(decoded).filter(x => x.endsWith("/role"))[0];
      this.data1.next(decoded[role]);
      return decoded[role];
    }
    this.data1.next("");
    return (null)
  }
  isActive() {
    let token: string = localStorage.getItem("token")
    if (token) {
      return this.jwtControllerService.isActive(token);
    }
  }

  currentUserIsCurrentSameInUrl(nickname: string): boolean{
    let currentNickName = this.getCurrentNickName();

    if (currentNickName === nickname){
      return true;
    }
    return false;
  }
  getIsAuth(){
    return this.isAuth;
  }
}
