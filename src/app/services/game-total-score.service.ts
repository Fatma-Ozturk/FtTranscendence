import { ListResponseModel } from 'src/app/models/listResponseModel';
import { GameTotalScoreByUserDto } from './../models/dto/gameTotalScoreByUserDto';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GameTotalScore } from '../models/entities/gameTotalScore';
import { SingleResponseModel } from '../models/singleResponseModel';
import { BaseService } from '../utilities/baseService';

@Injectable({
  providedIn: 'root'
})
export class GameTotalScoreService extends BaseService<GameTotalScore>{

  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.name = "game-total-scories";
  }

  getByNickName(nickName: string) {
    return this.httpClient.get<SingleResponseModel<GameTotalScore>>(environment.appurl + "game-total-scories/getbynickname?nickname=" + nickName);
  }

  getWithUserDtos(){
    return this.httpClient.get<ListResponseModel<GameTotalScoreByUserDto>>(environment.appurl + "game-total-scories/getwithuserdtos");
  }
}
