import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GameScore } from '../models/entities/gameScore';
import { BaseService } from '../utilities/baseService';

@Injectable({
  providedIn: 'root'
})
export class GameScoreService extends BaseService<GameScore> {

  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.name = "game-scories";
  }
}
