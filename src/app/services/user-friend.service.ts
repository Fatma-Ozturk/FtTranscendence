import { Injectable } from '@angular/core';
import { BaseService } from '../utilities/baseService';
import { UserFriend } from '../models/entities/userFriend';
import { HttpClient } from '@angular/common/http';
import { SingleResponseModel } from '../models/singleResponseModel';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class UserFriendService extends BaseService<UserFriend> {

	constructor(private httpClient: HttpClient) {
		super(httpClient);
		this.name = "user-friends";
	}
	getByFromUserIdAndTargetUserId(user: UserFriend) {
		return this.httpClient.post<SingleResponseModel<UserFriend>>(environment.appurl + this.name + "/getbyfromuseridandtargetuserid", user)
	}
}
