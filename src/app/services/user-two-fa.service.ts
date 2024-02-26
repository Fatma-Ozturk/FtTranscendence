import { Injectable } from '@angular/core';
import { BaseService } from '../utilities/baseService';
import { UserTwoFA } from '../models/entities/userTwoFA';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserTwoFAService extends BaseService<UserTwoFA>{

    constructor(private httpClient: HttpClient) {
		super(httpClient);
		this.name = "user-two-fas";
	  }
}
