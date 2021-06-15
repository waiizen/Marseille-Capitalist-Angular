import { Injectable } from '@angular/core';
import { World, Pallier, Product } from './../world';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestServiceService {

  server = "http://localhost:2612/";
  user = "";

  constructor(private http: HttpClient) { }

  getServer(){
    return this.server;
  }

  setServer(server: string){
    this.server = server;
  }

  getUser(){
    return this.user;
  }

  setUser(user: string){
    this.user = user;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  getWorld(): Promise<World> {
    return this.http.get(this.server + "Marseille-Capitalist/generic/world")
      .toPromise().catch(this.handleError);
  }


}
