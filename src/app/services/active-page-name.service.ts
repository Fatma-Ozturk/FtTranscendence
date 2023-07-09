import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivePageNameService {

  private data = new BehaviorSubject<string>("")
  activePageName = this.data.asObservable()

  private _pageName: string;
  public get pageName(): string {
    return this._pageName;
  }
  public set pageName(v: string) {
    this._pageName = v;
  }

  constructor() {
    this.data.next(this.pageName)
  }
  saveActivePage() {
    this.data.next(this.pageName)
  }
  loadActivePage(): string {
    return this._pageName;
  }
}