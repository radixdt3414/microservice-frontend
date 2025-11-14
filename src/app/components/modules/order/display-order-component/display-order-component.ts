import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HttpClientService } from '../../../../services/http-client-service';
import { PaginationPayload, PaginationResponse } from '../../../../common/models';
import { CatalogListResponse, Product } from '../../catalog-component/models/catalog-component.model';
import { API } from '../../../../common/endpoint';
import { CartService } from '../../../../services/cart-service';
import { Order } from './models/display-order-component.model';

@Component({
  selector: 'app-display-order-component',
  imports: [CommonModule],
  templateUrl: './display-order-component.html',
  styleUrl: './display-order-component.css'
})
export class DisplayOrderComponent {
  orders: Order[] = [];
  products: Product[] = [];
  constructor(private apiService: HttpClientService, private cartService: CartService) { }

  ngOnInit() {
    this.loadOrders();
  }

  toggle(order: Order) {
    order.expanded = !order.expanded;
  }

  expandAll() {
    this.orders.forEach(o => (o.expanded = true));
  }

  collapseAll() {
    this.orders.forEach(o => (o.expanded = false));
  }

  statusLabel(status: number): string {
    switch (status) {
      case 1: return '🟡 Processing';
      case 2: return '🟢 Completed';
      case 3: return '🔴 Cancelled';
      case 4: return '⚫ Failed';
      default: return '⚪ Unknown';
    }
  }

  statusClass(status: number): string {
    switch (status) {
      case 1: return 'processing';
      case 2: return 'completed';
      case 3: return 'cancelled';
      case 4: return 'failed';
      default: return 'unknown';
    }
  }

  private enrichOrdersWithProductsImage() {
    let counter = 1;
    this.orders.forEach(order => {
      order.orderItems.forEach(item => {
        counter++;
        item.image = "https://picsum.photos/300/200?random=" + (counter + 1);
      });
    });
  }

  loadOrders() {
    let payload = {
      CustomerId: this.cartService.customerId
    }
    this.apiService.post<{ orderList: Order[] }>(API.ORDER.GET_BY_CUSTOMER_ID, payload).subscribe({
      next: (data) => {
        console.log("Data:", data.orderList);
        if (data.orderList == null) {
          this.orders = [];
        }
        else {
          this.orders = data.orderList;
          this.enrichOrdersWithProductsImage();
        }

      },
      error: (err) => console.error('Error loading products', err)
    });
  }
}