import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, finalize, tap } from 'rxjs';
import { LoadProgressService } from '../services/load-progress.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class MyHttpLoadInterceptor implements HttpInterceptor {
  count: number = 0;

  constructor(private loadProgressService: LoadProgressService,
    private spinner: NgxSpinnerService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.loadProgressService.visible();
    this.spinner.show();
    this.count++;
    return next.handle(request)
      .pipe(tap(
      ), finalize(() => {
        this.loadProgressService.hidden();
        this.loadProgressService.visible();
        this.count--;
        if (this.count == 0){
          setTimeout(() => {
            this.spinner.hide();
          }, 100);
        }
      })
      );
  }
}
