import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Achievement } from '../models/entities/achievement';
import { BaseService } from '../utilities/baseService';

@Injectable({
  providedIn: 'root'
})
export class AchievementService extends BaseService<Achievement> {

  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.name = "achievements";
  }
}
