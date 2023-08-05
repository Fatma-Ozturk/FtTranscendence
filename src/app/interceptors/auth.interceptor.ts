import { UserService } from './../services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/entities/user';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private authService: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let token = localStorage.getItem("token");
    // let userStatus: boolean = this.authService.getCurrentStatus();
    // if (userStatus == false) {
    //   console.log("enes");
    //   if (window.location.href.toString().indexOf("create-user-profile") <= -1) {
    //     this.router.navigate(['/create-user-profile']);
    //   }
    // }
    let newRequest: HttpRequest<any>;
    newRequest = request.clone({
      headers: request.headers.set("Authorization", "Bearer " + token)
    })
    return next.handle(newRequest);
  }
}
