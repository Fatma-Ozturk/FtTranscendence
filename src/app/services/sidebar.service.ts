import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private data = new BehaviorSubject<boolean>(false)
  isVisible = this.data.asObservable()
  constructor() {

   }
  autoVisible(){
    if (localStorage.getItem("sidebar")==="sidebar visible") {
      localStorage.setItem("sidebar","d-none w-0 h-0 invisible")
      this.data.next(true);
    }else if (localStorage.getItem("sidebar")==="d-none w-0 h-0 invisible") {
      localStorage.setItem("sidebar","sidebar visible")
      this.data.next(false);
    }
  }
  visible(){
    localStorage.setItem("sidebar","d-none w-0 h-0 invisible")
    this.data.next(true);
  }
  hidden(){
    localStorage.setItem("sidebar","sidebar visible")
    this.data.next(false);
  }
  getVisibility():string{
    return String(localStorage.getItem("sidebar"))
  }
}