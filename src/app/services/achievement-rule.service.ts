import { ResponseModel } from './../models/responseModel/responseModel';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AchievementRule } from '../models/entities/achievementRule';
import { BaseService } from '../utilities/baseService';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AchievementRuleService extends BaseService<AchievementRule> {

  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.name = "achievement-rules";
  }

  checkAchievement(userId: number, achName: string) {
    let newPath = environment.appurl + "achievement-rules/checkachievement?userId=" + userId + "&" + "achName=" + achName;
    return this.httpClient.get<ResponseModel>(newPath);
  }
}