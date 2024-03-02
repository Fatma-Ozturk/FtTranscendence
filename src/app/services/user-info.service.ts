import { ResponseModel } from 'src/app/models/responseModel/responseModel';
import { UserInfo } from './../models/entities/userInfo';
import { BaseService } from './../utilities/baseService';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SingleResponseModel } from '../models/singleResponseModel';
import { UserForSearchDto } from '../models/dto/userForSearchDto';
import { ListResponseModel } from '../models/listResponseModel';
import { UserForUserInfoDto } from '../models/dto/userForUserInfoDto';

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

  uploadProfileImage(nickName: string, file: File) {
    const formData: FormData = new FormData();
    formData.append('image', file, file.name);
    formData.append('nickname', nickName);

    return this.httpClient.post<ResponseModel>(environment.appurl + "user-infos/uploadprofileimage", formData);
  }

  getProfileImage(profileImagePath: string): string {
    if (profileImagePath == null || profileImagePath === undefined || profileImagePath == "") {
      return ("assets/player.png");
    }
    return (environment.profileImageUrl + profileImagePath);
  }
  getByAttributes(userForSearchDto: UserForSearchDto) {
    return this.httpClient.post<ListResponseModel<UserForUserInfoDto>>(environment.appurl + "user-infos/getbyattributes", userForSearchDto);
  }
}
