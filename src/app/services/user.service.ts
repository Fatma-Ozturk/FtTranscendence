import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/models/entities/user';
import { ListResponseModel } from 'src/app/models/listResponseModel';
import { ResponseModel } from 'src/app/models/responseModel/responseModel';
import { SingleResponseModel } from 'src/app/models/singleResponseModel';
import { environment } from 'src/environments/environment';
import { BaseService } from 'src/app/utilities/baseService';
import { Observable } from 'rxjs';
import { OperationClaim } from '../models/entities/operationClaim';
import { UserForSearchDto } from '../models/dto/userForSearchDto';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<User>{

  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.name = "users";
  }
  isUserVerificationCode(verificationCode: string): Observable<SingleResponseModel<boolean>> {
    let newPath = environment.appurl + "users/isuserverificationcode?verificationCode=" + verificationCode
    return this.httpClient.get<SingleResponseModel<boolean>>(newPath);
  }
  deleteById(userId: number) {
    let newPath = environment.appurl + "users/deletebyid?id=" + userId
    return this.httpClient.get<ResponseModel>(newPath);
  }
  /*RePublic*/
  getUsers(): Observable<ListResponseModel<User>> {
    let newPath = environment.appurl + "users/getall"
    return this.httpClient.get<ListResponseModel<User>>(newPath);
  }
  // getUser(id: number): Observable<SingleResponseModel<User>> {
  //   let newPath = environment.appurl + "users/getbyid?id=" + id
  //   return this.httpClient.get<SingleResponseModel<User>>(newPath);
  // }
  getById(id: number) {
    return this.httpClient.get<SingleResponseModel<User>>(environment.appurl + "users/getbyid?id=" + id);
  }
  getByMail(email: string) {
    return this.httpClient.get<SingleResponseModel<User>>(environment.appurl + "users/getbymail?email=" + email);
  }
  getByNickName(nickName: string) {
    return this.httpClient.get<SingleResponseModel<User>>(environment.appurl + "users/getbynickname?nickname=" + nickName);
  }
  getStatusByMail(email: string) {
    return this.httpClient.get<SingleResponseModel<boolean>>(environment.appurl + "users/getstatusbymail?email=" + email);
  }
  getAllOperationClaimRank(userId: number): Observable<ListResponseModel<OperationClaim>> {
    let newPath = environment.appurl + "users/getalloperationclaimrank?userId=" + userId
    return this.httpClient.get<ListResponseModel<OperationClaim>>(newPath);
  }
  /* getAuthDetail(userId:number): Observable<SingleResponseModel<AuthListDetailDto>> {
    let newPath = environment.appurl + "users/getauthdetail?userId="+userId
    return this.httpClient.get<SingleResponseModel<AuthListDetailDto>>(newPath);
  } */
  getUserVerificationCode(verificationCode: string): Observable<SingleResponseModel<User>> {
    let newPath = environment.appurl + "users/getuserverificationcode?verificationCode=" + verificationCode
    return this.httpClient.get<SingleResponseModel<User>>(newPath);
  }
  getClaim(userId: number): Observable<SingleResponseModel<OperationClaim>> {
    let newPath = environment.appurl + "users/getclaim?id=" + userId
    return this.httpClient.get<SingleResponseModel<OperationClaim>>(newPath);
  }
  /* getAuthDetails(): Observable<ListResponseModel<AuthListDetailDto>> {
    let newPath = environment.appurl + "users/getauthdetails"
    return this.httpClient.get<ListResponseModel<AuthListDetailDto>>(newPath);
  } */
}
