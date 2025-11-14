import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Cart, CartItem } from '../components/modules/cart/cart-details-component/models/cart-details-component.model';
import { HttpClientService } from './http-client-service';
import { API } from '../common/endpoint';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  public userName = new BehaviorSubject<string>("");
  public customerId: string = "";
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();
  public totalPrice =0; 
  apiService = inject(HttpClientService);
  // constructor(private http: HttpClient) { }

  addToCart(product: CartItem) {
    const existing = this.cartItems.find(p => p.productId === product.productId);
    if (existing) {
      existing.quentity += product.quentity;
    } else {
      this.cartItems.push(product);
    }
    this.cartSubject.next(this.cartItems);
    this.updateCart();
    
    console.log("cart Username:",this.userName.value);
    console.log("cart items:",this.cartItems);
  }

  removeFromCart(productId: string) {
    this.cartItems = this.cartItems.filter(p => p.productId !== productId);
    this.cartSubject.next(this.cartItems);
    this.updateCart();
    
    console.log("cart Username:",this.userName.value);
    console.log("cart items:",this.cartItems);
  }

  updateQuantity(productId: string, change: number) {
    const item = this.cartItems.find(p => p.productId === productId);
    if (item) {
      item.quentity += change;
      if (item.quentity <= 0) {
        this.removeFromCart(productId);
      }
      this.cartSubject.next(this.cartItems);
    }
    this.updateCart();
    
    console.log("cart Username:",this.userName.value);
    console.log("cart items:",this.cartItems);
  }

  clearCart() {
    this.cartItems = [];
    this.cartSubject.next(this.cartItems);
    this.deleteCart();
    
    console.log("cart Username:",this.userName.value);
    console.log("cart items:",this.cartItems);
  }

  getCartItems(): CartItem[] {
    return [...this.cartItems];
  }

  updateCart() {
    
    this.cartItems.forEach(item=>{
      this.totalPrice = this.totalPrice + (item.quentity * item.price);
    });
    // API call to persist cart
    const payload = {
      Id: "00000000-0000-0000-0000-000000000000",
      UserName: this.userName.value,
      Items: this.cartItems,
      TotalPrice: this.totalPrice 
    }
    console.log("payload:" , payload);
    return this.apiService.post(API.CART.CRUD, {cart:payload}).subscribe({
      next: (data) => {
        console.log("Cart Data:", data);
        alert("Cart details updated");
        // this.cartService.loadCart(this.userName, data?.cart);
      },
      error: (err) => console.error('Error loading products', err)
    });
  }


  deleteCart() {
    // API call to persist cart
    return this.apiService.delete<{ IsSuccess: boolean }>(API.CART.CRUD +'?UserName='+ this.userName.value).subscribe({
      next: (data) => {
        console.log("Cart deleted:", data);
        if (data.IsSuccess) {
          this.userName.next("");
          this.customerId = "";
          alert("Cart deleted");
        }
      },
      error: (err) => console.error('Error loading products', err)
    });
  }

  
  loadCart(userName: string, customerId: string){
    console.log("cart service loadcart");
    this.apiService.get<{cart : Cart | null}>(API.CART.CRUD + '?UserName='+userName).subscribe({
      next: (data) => {
        console.log("cart service Data:", data.cart);
        console.log("cart service name:", userName);
        this.mapCart(userName, customerId, data?.cart);
      },
      error: (err) => {
        console.log("error cart service name:", userName, customerId);
        this.mapCart(userName, customerId);
        alert(err.statusText);
        console.error('Error loading cart in cart service', err);
      }
    });
  }


  mapCart(userName: string, customerId: string, cartDetails: Cart | null = null) {
        console.log("cart name:",userName);

    this.customerId = customerId;
    this.userName.next(userName);

    if (cartDetails == null) {
      // this.clearCart();
       this.cartItems = [];
    this.cartSubject.next(this.cartItems);
    }
    else {
      this.cartItems = cartDetails.items;
      this.cartSubject.next(this.cartItems);
    }

    console.log("cart Username:",this.userName.value);
    console.log("customer id:",this.customerId);
    console.log("cart items:",this.cartItems);
  }
}