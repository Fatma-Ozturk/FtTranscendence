import { ListResponseModel } from 'src/app/models/listResponseModel';
import { Injectable } from '@angular/core';
import { UserBlock } from '../models/entities/userBlock';
import { BaseService } from '../utilities/baseService';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/responseModel/responseModel';

@Injectable({
	providedIn: 'root'
})
export class UserBlockService extends BaseService<UserBlock> {

	constructor(private httpClient: HttpClient) {
		super(httpClient);
		this.name = "user-blocks";
	}

	getByBlockerId(blockerId: number) {
		return this.httpClient.get<ListResponseModel<UserBlock>>(environment.appurl + this.name + "/getbyblockerid?blockerId=" + blockerId);
	}
	updateStatusByBlockerIdBlockedId(updateUserBlock: UserBlock){
		return this.httpClient.post<ResponseModel>(environment.appurl + this.name + "/updateStatusByBlockerIdBlockedId", updateUserBlock)
	}
}
