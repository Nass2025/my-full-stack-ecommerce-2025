import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Product} from '../common/product';
import {ProductCategory} from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl ="http://localhost:8080/api/products";
  private categoryUrl ="http://localhost:8080/api/product-category";
  constructor(private httpClient: HttpClient) { }



  getProductListPaginate(page:number,
                         pageSize:number,
                         categoryId: number): Observable<GetResponseProducts>{

    const paginateUrl= `${this.baseUrl}/search/findByCategoryId?id=${categoryId}&page=${page}&size=${pageSize}`;

    return this.httpClient.get<GetResponseProducts>(paginateUrl);

  }

  getProductList(categoryId: number): Observable<Product[]>{

    const searchUrl= `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;

    return this.getProducts(searchUrl);

  }


  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory )
    );

  }

  searchProducts(searchKeyword: string | null) {
    const searchUrl = this.baseUrl+"/search/findByNameContaining?name="+searchKeyword;
    return this.getProducts(searchUrl);

  }

  searchProductsPaginate(page:number,
                         pageSize:number,
                         searchKeyword: string): Observable<GetResponseProducts>{

    const paginateUrl= `${this.baseUrl}/search/findByNameContaining?name=${searchKeyword}&page=${page}&size=${pageSize}`;

    return this.httpClient.get<GetResponseProducts>(paginateUrl);

  }

  private getProducts(searchUrl: string) {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  public getProduct(productId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${productId}`;
    return this.httpClient.get<Product>(productUrl);
  }
}
interface GetResponseProducts{
 _embedded:{
   products: Product[];
 }
 page:{
   size:number,
   totalElements: number,
   totalPages: number,
   number: number
 }
}

interface GetResponseProductCategory{
  _embedded:{
    productCategory: ProductCategory[];
  }
}
