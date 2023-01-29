import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from '../common/category';
import { Product } from '../common/product';
import { ProductPage } from '../common/product-page';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private categoryUrl = environment.storeUrl + '/categories';
  private baseUrl = environment.storeUrl + '/products';

  constructor(private httpClient: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(this.categoryUrl);
  }

  getProductList(id: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(
      `${this.baseUrl}/search/findByCategoryId?id=${id}`
    );
  }

  searchProducts(theKeywordo: string): Observable<Product[]> {
    return this.httpClient.get<Product[]>(
      `${this.baseUrl}/search/findByNameContaining?name=${theKeywordo}`
    );
  }

  getProductDetails(id: number) {
    return this.httpClient.get<Product>(`${this.baseUrl}/${id}`);
  }

  getProductListPaginate(
    thePage: number,
    thePageSize: number,
    theCategoryId: number
  ): Observable<ProductPage> {
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<ProductPage>(searchUrl);
  }

  searchProductPaginate(
    thePage: number,
    thePageSize: number,
    theCategoryId: number,
    name: string
  ): Observable<ProductPage> {
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}&page=${thePage}&size=${thePageSize}&name=${name}`;
    return this.httpClient.get<ProductPage>(searchUrl);
  }
}
