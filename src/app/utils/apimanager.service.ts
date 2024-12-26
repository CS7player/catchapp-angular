import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from './constants.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  dopost(URL: string,body : any){
    return this.http.post(URL, body);
  }
}
