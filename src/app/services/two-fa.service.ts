import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../utilities/baseService';
import { User } from '../models/entities/user';
import { SingleResponseModel } from '../models/singleResponseModel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TwoFAService extends BaseService<any> {

    constructor(private httpClient: HttpClient) {
		super(httpClient);
		this.name = "two-fas";
	}

	generate(user: any) {
		return this.httpClient.post<SingleResponseModel<any>>(environment.appurl + "two-fas/generate", user);
	}
}
