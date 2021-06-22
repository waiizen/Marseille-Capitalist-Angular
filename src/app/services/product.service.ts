import { Injectable } from '@angular/core';
import { Product} from "../world";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  productList: Product[] = [];

  productSubject = new Subject<Product[]>();

  constructor() { }

  emitProductSubject(){
    this.productSubject.next(this.productList);
  }

  setProductList(productList: any){
    this.productList = productList;
  }

  setManagerUnlocked(id: number){
    for(let product of this.productList){
      if(product.id == id) product.managerUnlocked = true;
    }
    this.emitProductSubject();
  }

  getProductName(id: number){
    for(let product of this.productList){
      if(product.id == id) return product.name;
    }
    return "defaultName";
  }

}
