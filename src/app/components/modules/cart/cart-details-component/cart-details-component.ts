import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartItem } from './models/cart-details-component.model';
import { CartService } from '../../../../services/cart-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cart-details-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './cart-details-component.html',
  styleUrl: './cart-details-component.css'
})
export class CartDetailsComponent {
  cartItems: CartItem[] = [];
  totalItems = 0;
  grandTotal = 0;

  constructor(private cartService: CartService, private route: Router) { }

  ngOnInit(): void {
    this.cartService.cart$.subscribe((items: CartItem[]) => {
      console.log("Cart - item: ", items)
      this.cartItems = items;
      this.calculateTotals();
    });
  }

  increase(item: CartItem) {
    this.cartService.updateQuantity(item.productId, 1);
  }

  decrease(item: CartItem) {
    this.cartService.updateQuantity(item.productId, -1);
  }

  remove(item: CartItem) {
    this.cartService.removeFromCart(item.productId);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  private calculateTotals() {
    this.totalItems = this.cartItems.reduce((sum, item) => sum + item.quentity, 0);
    this.grandTotal = this.cartItems.reduce((sum, item) => sum + item.price * item.quentity, 0);
    this.cartService.totalPrice = this.grandTotal;
  }

  goToCheckout(){
    this.route.navigate(["/cart/checkout"]);
  }
}