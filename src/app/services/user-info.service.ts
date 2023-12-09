import { UserInfo } from './../models/entities/userInfo';
import { BaseService } from './../utilities/baseService';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SingleResponseModel } from '../models/singleResponseModel';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService extends BaseService<UserInfo>{
  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.name = "user-infos";
  }

  getByNickName(nickName: string) {
    return this.httpClient.get<SingleResponseModel<UserInfo>>(environment.appurl + "user-infos/getbynickname?nickname=" + nickName);
  }
}
