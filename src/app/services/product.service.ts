import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../common/category';
import { Product } from '../common/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private categoryUrl = 'http://localhost:3000/categories';
  private baseUrl = 'http://localhost:3000/products';

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
}
