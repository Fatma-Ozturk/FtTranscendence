import { Injectable } from '@angular/core';
import { BaseService } from '../utilities/baseService';
import { DirectMessage } from '../models/entities/directMessage';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class DirectMessageService extends BaseService<DirectMessage> {
	constructor(private httpClient: HttpClient) {
		super(httpClient);
		this.name = "direct-messages";
	}
}
