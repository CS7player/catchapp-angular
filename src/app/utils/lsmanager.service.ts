import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LsmanagerService {

  constructor() { }

  setData(key:string,val:string){
    localStorage.setItem(key,val);
  }

  getData(key :string){
    let data : string = localStorage.getItem(key) || '';
    return data;
  }

  clearAll(){
    localStorage.clear();
  }
}
