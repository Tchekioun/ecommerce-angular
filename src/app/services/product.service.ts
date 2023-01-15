import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://localhost:3000/products';

  constructor(private httpClient: HttpClient) {}

  getProductList(id: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.baseUrl + id);
  }
}
