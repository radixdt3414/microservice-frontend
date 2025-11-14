import { Component, EventEmitter } from '@angular/core';
import { CatalogListResponse, Product } from '../../catalog-component/models/catalog-component.model';
import { HttpClientService } from '../../../../services/http-client-service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { API } from '../../../../common/endpoint';
import { PaginationPayload, PaginationResponse } from '../../../../common/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-product-component',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './list-product-component.html',
  styleUrl: './list-product-component.css',

})
export class ListProductComponent {


  products: Product[] = [];
  totalRecords: number = 0;
  pageLimit: number = 5;
  currentPage: number = 1;

  sortColumn: string = '';
  sortOrder: 'asc' | 'desc' = 'desc';
  totalPages = 0;


  pageChange = new EventEmitter<PaginationPayload>();
  constructor(private apiService: HttpClientService, private router: Router) {
    this.loadProducts({
      "PageLimit": this.pageLimit,
      "PageIndex": this.currentPage,
      "SortBy": "",
      "SortOrder": "desc"
    });
    this.pageChange.subscribe(payload => {
      this.loadProducts(payload)
    });
  }


  onPrevious() {
    if (this.currentPage > 1) {
      this.emitPageChange(this.currentPage - 1);
    }
  }

  onNext() {
    if (this.currentPage < this.totalPages) {
      this.emitPageChange(this.currentPage + 1);
    }
  }

  // onSort(column: string) {
  //   if (this.sortColumn === column) {
  //     this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  //   } else {
  //     this.sortColumn = column;
  //     this.sortOrder = 'asc';
  //   }
  //   this.emitSortChange();
  // }

  private emitPageChange(pageIndex: number) {
    this.currentPage = pageIndex;
    this.pageChange.emit({
      PageIndex: this.currentPage,
      PageLimit: this.pageLimit,
      SortBy: this.sortColumn || null,
      SortOrder: this.sortOrder
    });
  }

  loadProducts(payload: PaginationPayload) {
    this.apiService.post<PaginationResponse<CatalogListResponse>>(API.CATALOG.LIST, payload).subscribe({
      next: (data) => {
        console.log("Data:", data.data);
        if(data.data == null){
          this.products = [];  
        }
        else{
          this.products = data.data.lstProducts;
        }
        
        this.products.forEach((item, ind) => {
          item.image = "https://picsum.photos/300/200?random=" + (ind + 1);
        });
        this.totalPages = data.pageCount;
        this.totalRecords = data.totalRecords;
      },
      error: (err) => console.error('Error loading products', err)
    });
  }

  editProduct(product: Product) {
    this.router.navigate(['/products/edit'], { queryParams: { id: product.id } });
  }

  addProduct() {
    this.router.navigate(['/products/add']); // no ID, means Add mode
  }

  deleteProduct(product: Product) {
    
    this.apiService.delete<{isSuccess: boolean}>(API.CATALOG.CRUD +'/'+ product.id).subscribe({
      next: (data) => {
        console.log("Is product deleted:", data);
        alert("Is product deleted:"+ data.isSuccess);
        this.loadProducts({
          "PageLimit": this.pageLimit,
          "PageIndex": this.currentPage,
          "SortBy": "",
          "SortOrder": "desc"
        });
      },
      error: (err) => { alert("Is product deleted: NO"); console.error('Error while deleting product', err)}
    });
  }

  discount(product: Product) {

  }

}
