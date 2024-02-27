import { Injectable } from '@angular/core';
import { BaseService } from '../utilities/baseService';
import { UserTwoFA } from '../models/entities/userTwoFA';
import { HttpClient } from '@angular/common/http';
import { SingleResponseModel } from '../models/singleResponseModel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserTwoFAService extends BaseService<UserTwoFA>{

    constructor(private httpClient: HttpClient) {
		super(httpClient);
		this.name = "user-two-fas";
	}

	getByUserId(userId: number){
		return this.httpClient.get<SingleResponseModel<UserTwoFA>>(environment.appurl + "user-two-fas/getbyuserid?userId=" + userId);
	}
}
