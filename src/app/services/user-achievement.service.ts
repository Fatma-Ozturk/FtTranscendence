import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserAchievement } from '../models/entities/userAchievement';
import { BaseService } from '../utilities/baseService';

@Injectable({
  providedIn: 'root'
})
export class UserAchievementService extends BaseService<UserAchievement> {

  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.name = "user-achievements";
  }
}