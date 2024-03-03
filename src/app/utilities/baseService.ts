import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from 'src/app/models/listResponseModel';
import { ResponseModel } from 'src/app/models/responseModel/responseModel';
import { SingleResponseModel } from 'src/app/models/singleResponseModel';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BaseService<T>{
    private _name: string;
    public get name(): string {
        return this._name;
    }
    public set name(v: string) {
        this._name = v;
    }

    constructor(private httpClientBase: HttpClient) {

    }
    gets(): Observable<ListResponseModel<T>> {
        let newPath = environment.appurl + this._name + "/getall"
        return this.httpClientBase.get<ListResponseModel<T>>(newPath);
    }
    get(id: number): Observable<SingleResponseModel<T>> {
        let newPath = environment.appurl + this._name + "/getbyid?id=" + id
        return this.httpClientBase.get<SingleResponseModel<T>>(newPath);
    }
    add(t: T): Observable<ResponseModel> {
        return this.httpClientBase.post<ResponseModel>(environment.appurl + this._name + "/add", t)
    }
    update(t: T): Observable<ResponseModel> {
        return this.httpClientBase.post<ResponseModel>(environment.appurl + this._name + "/update", t)
    }
    delete(id: number):Observable<ResponseModel>{
        return this.httpClientBase.get<ResponseModel>(environment.appurl + this._name + "/delete?id=" + id)
    }
}
