import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GameResultName } from '../models/entities/gameResultName';
import { BaseService } from '../utilities/baseService';

@Injectable({
  providedIn: 'root'
})
export class GameResultNameService extends BaseService<GameResultName>{

  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.name = "game-result-names";
  }
}
