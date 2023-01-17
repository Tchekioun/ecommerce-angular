import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductPage } from 'src/app/common/product-page';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentCateogryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyword: string = '';

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

    if (this.previousCategoryId != this.currentCateogryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCateogryId;
    console.log(
      `cuurent category ${this.currentCateogryId} PageNumber: ${this.thePageNumber}`
    );

    this.productService
      .getProductListPaginate(
        this.thePageNumber,
        this.thePageSize,
        this.currentCateogryId
      )
      .subscribe((data) => {
        this.products = data.products;
        this.theTotalElements = data.page.theTotalElements;
        this.thePageNumber = data.page.thePageNumber;
        this.thePageSize = data.page.thePageSize;
      });
  }

  handleSearchProduct() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;
    console.log(`keyword = ${theKeyword}`);
    this.productService
      .searchProductPaginate(
        this.thePageNumber,
        this.thePageSize,
        this.currentCateogryId,
        theKeyword
      )
      .subscribe(this.processResulst());
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProduct();
    } else {
      this.handleListProducts();
    }
  }

  updatePageSize(value: number) {
    this.thePageSize = value;
    this.listProducts();
  }

  processResulst() {
    return (data: ProductPage) => {
      this.products = data.products;
      this.thePageNumber = data.page.thePageNumber;
      this.thePageSize = data.page.thePageSize;
      this.theTotalElements = data.page.theTotalElements;
    };
  }
}
