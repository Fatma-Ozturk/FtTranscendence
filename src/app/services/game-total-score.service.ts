import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GameTotalScore } from '../models/entities/gameTotalScore';
import { BaseService } from '../utilities/baseService';

@Injectable({
  providedIn: 'root'
})
export class GameTotalScoreService extends BaseService<GameTotalScore>{

  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.name = "game-total-scories";
  }
}
