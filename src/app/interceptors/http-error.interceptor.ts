import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private router:Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let res = next.handle(request);
    res.pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status == 404) {
          this.router.navigate(['404'])
        }
        return throwError(error);
      }));
    return (res);
  }
}
