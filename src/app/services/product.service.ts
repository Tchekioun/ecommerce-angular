import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../common/category';
import { Product } from '../common/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://localhost:3000/products';
  private categoryUrl = 'http://localhost:3000/categories';

  constructor(private httpClient: HttpClient) {}

  getProductList(id: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(
      `${this.baseUrl}/search/findByCategoryId?id=${id}`
    );
  }

  getCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(this.categoryUrl);
  }
}
