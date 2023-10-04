import { BaseService } from 'src/app/utilities/baseService';
import { Injectable } from '@angular/core';
import { GameHistory } from '../models/entities/gameHistory';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GameHistoryService extends BaseService<GameHistory>{

  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.name = "game-histories";
  }
}
