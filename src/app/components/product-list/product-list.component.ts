import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentCateogryId: number = 1;
  searchMode: boolean = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  handleListProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      this.currentCateogryId = +this.route.snapshot.paramMap.get('id')!;
    } else {
      this.currentCateogryId = 1;
    }
    this.productService
      .getProductList(this.currentCateogryId)
      .subscribe((data) => {
        this.products = data;
      });
  }

  handleSearchProduct() {
    const theKeywordo: string = this.route.snapshot.paramMap.get('keyword')!;
    this.productService.searchProducts(theKeywordo).subscribe((data) => {
      this.products = data;
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProduct();
    } else {
      this.handleListProducts();
    }
  }
}
