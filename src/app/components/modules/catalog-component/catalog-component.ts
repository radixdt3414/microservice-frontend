import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { CatalogListResponse, Product } from './models/catalog-component.model';
import { CommonModule } from '@angular/common';
import { HttpClientService } from '../../../services/http-client-service';
import { API } from '../../../common/endpoint';
import { HttpClientModule } from '@angular/common/http';
import { CartService } from '../../../services/cart-service';
import { Cart } from '../cart/cart-details-component/models/cart-details-component.model';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-catalog-component',
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './catalog-component.html',
  styleUrl: './catalog-component.css',
  // providers: [HttpClientService]
})
export class CatalogComponent implements AfterViewInit {
 products: Product[] = [];
 default_limit = 0;
 default_index = 1;
 customerId = "";
 userName: string = ''; // 👈 store username

  constructor(private cartService: CartService, private apiService: HttpClientService, private authService: AuthService){
    authService.currentUser$.subscribe((data)=>{
      if(data != null && data != undefined){
            this.cartService.loadCart(data.unique_name, data.sub);
      }
    });
    cartService.userName.subscribe((data)=>{
      this.userName = data;
      this.customerId = cartService.customerId;
    });
   this.products =[
    // {
    //   id: '1',
    //   name: 'Product 1',
    //   description: 'This is the first product.',
    //   price: 99.99,
    //   image: 'https://picsum.photos/300/200?random=1',
    //   categories: ['Category A', 'Category B']
    // },
    // {
    //   id: '2',
    //   name: 'Product 2',
    //   description: 'Second product description.',
    //   price: 149.99,
    //   image: 'https://picsum.photos/300/200?random=2',
    //   categories: ['Category C']
    // }
  ];
  this.loadProducts();
 }

 loadProducts() {
    this.apiService.post<{ data: CatalogListResponse}>(API.CATALOG.LIST,{
    "PageLimit": this.default_limit,
    "PageIndex": this.default_index,
    "SortBy": "",
    "SortOrder": "desc"
}).subscribe({
      next: (data) => {
        console.log("Data:", data.data);
        this.products = data.data.lstProducts;
        this.products.forEach((item, ind) => {
          item.image = "https://picsum.photos/300/200?random=" + (ind + 1);
        })
      },
      error: (err) => console.error('Error loading products', err)
    });
  }

 ngAfterViewInit(): void {
   console.log("data:", this.products);
 }

  addToCart(product: Product) {
            console.log("name:", this.userName);

    if (!this.cartService.userName.value) return; // safeguard
    this.cartService.addToCart({
      productId: product.id!,
      productName: product.name,
      price: product.price,
      color: 'Default',
      quentity: 1
    });
  }

  loadCart(){
    this.cartService.loadCart(this.userName, this.customerId);
  }
}
