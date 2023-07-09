import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CookieStorageService {

  
  constructor(private cookieService: CookieService) { }
  saveItem(name:string,value:string){
    this.cookieService.set(name,value)
  }
  get(name:string):string{
    return this.cookieService.get(String(name));
  }
  clearItem(name:string){
    this.cookieService.delete(name);
  }
  clear(){
    this.cookieService.deleteAll();
  }
  check(name:string):Boolean{
    return this.cookieService.check(name);
  }
}