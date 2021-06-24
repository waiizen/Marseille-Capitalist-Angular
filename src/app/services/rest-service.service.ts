  import { Injectable } from '@angular/core';
import { World, Pallier, Product } from './../world';
import {HttpClient, HttpHeaders} from '@angular/common/http';

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
    return this.http.get(
      this.server + "Marseille-Capitalist/generic/world", {
        headers: this.setHeaders(this.user)
      }
    ).toPromise().catch(this.handleError);
  }

  private setHeaders(user:string) : HttpHeaders {
    let headers = new HttpHeaders({'X-User': user});
    return headers;
  };

  public putManager(manager: Pallier): Promise<Response> {
    return this.http
      .put(this.server + 'Marseille-Capitalist/generic/manager', manager, {
        headers: this.setHeaders(this.user),
      })
      .toPromise()
      .catch(this.handleError);
  }

  public putProduct(product: Product): Promise<Response> {
    return this.http
      .put(this.server + 'Marseille-Capitalist/generic/product', product, {
        headers: this.setHeaders(this.user),
      })
      .toPromise()
      .catch(this.handleError);
  }

  public putUpgrade(upgrade: Pallier): Promise<Response> {
    return this.http
      .put(this.server + 'Marseille-Capitalist/generic/upgrade', upgrade, {
        headers: this.setHeaders(this.user),
      })
      .toPromise()
      .catch(this.handleError);
  }


}
