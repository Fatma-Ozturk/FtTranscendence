import { UserAchievementByAchievementDto } from './../models/dto/userAchievementByAchievementDto';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserAchievement } from '../models/entities/userAchievement';
import { BaseService } from '../utilities/baseService';
import { ListResponseModel } from '../models/listResponseModel';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserAchievementService extends BaseService<UserAchievement> {

  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.name = "user-achievements";
  }

  getAllUserAchievementByAchievementDtoWithUserId(userId: number): Observable<ListResponseModel<UserAchievementByAchievementDto>> {
    let newPath = environment.appurl + "user-achievements/getalluserachievementbyachievementdtowithuserid?userId=" + userId;
    return this.httpClient.get<ListResponseModel<UserAchievementByAchievementDto>>(newPath);
  }

}