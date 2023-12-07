import { UserInfo } from './../models/entities/userInfo';
import { BaseService } from './../utilities/baseService';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService extends BaseService<UserInfo>{
  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.name = "user-infos";
  }
}
