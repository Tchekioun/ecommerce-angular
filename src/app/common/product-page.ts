import { Product } from './product';
export interface ProductPage {
  products: Product[];
  page: {
    theTotalElements: number;
    thePageNumber: number;
    thePageSize: number;
  };
}
