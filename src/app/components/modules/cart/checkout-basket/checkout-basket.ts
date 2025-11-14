import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../../../services/cart-service';
import { HttpClientService } from '../../../../services/http-client-service';
import { API } from '../../../../common/endpoint';

@Component({
  selector: 'app-checkout-basket',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout-basket.html',
  styleUrl: './checkout-basket.css'
})
export class CheckoutBasket {
  checkoutForm: FormGroup;
  constructor(private fb: FormBuilder, private cartService: CartService, private apiService: HttpClientService) {


    this.checkoutForm = fb.group({
      // Customer Info
      CustomerId: [cartService.customerId, Validators.required],
      UserName: [cartService.userName.value, Validators.required],
      TotalPrice: [cartService.totalPrice, Validators.required],

      // Payment
      CardNumber: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(16)]],
      Cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
      ExpiryDate: ['', Validators.required],
      PaymentType: ['', Validators.required],
      CardMemberName: ['', Validators.required],

      // Shipping Address
      Shipping_FirstName: ['', Validators.required],
      Shipping_LastName: ['', Validators.required],
      Shipping_Country: ['', Validators.required],
      Shipping_Landmark: [''],
      Shipping_State: ['', Validators.required],
      Shipping_City: ['', Validators.required],
      Shipping_PostalCode: ['', Validators.required],
      Shipping_Description: [''],

      // Order Address
      Order_FirstName: ['', Validators.required],
      Order_LastName: ['', Validators.required],
      Order_Country: ['', Validators.required],
      Order_Landmark: [''],
      Order_State: ['', Validators.required],
      Order_City: ['', Validators.required],
      Order_PostalCode: ['', Validators.required],
      Order_Description: ['']
    });


  }

  submit() {
    console.log("checkout data:", this.checkoutForm)
    if (this.checkoutForm.valid) {
      console.log('Checkout Payload:', this.checkoutForm.value);
      this.apiService.post<{ isSuccess: boolean }>(API.CART.CHECKOUT, { CheckoutDetails: this.checkoutForm.getRawValue()}).subscribe({
        next: (data: { isSuccess: boolean }) => {
          console.log("Data:", data);
          console.log("order sent successfully: ", data.isSuccess);
          if (data.isSuccess) {
            alert("Order sent successfully:" + data.isSuccess);
            let uname = this.cartService.userName.value;
            let cId = this.cartService.customerId;
            this.cartService.loadCart(uname, cId);
          }
        },
        error: (err) => {
          console.log("checkout error: ", err);
          alert(err.statusText);
          console.error('Error encounter while sent order', err);
        }
      });

    } else {
      alert('Please fill all required fields');
      this.checkoutForm.markAllAsTouched();
    }
  }

  copyShippingToOrder() {
    const shippingControls = [
      'Shipping_FirstName',
      'Shipping_LastName',
      'Shipping_Country',
      'Shipping_Landmark',
      'Shipping_State',
      'Shipping_City',
      'Shipping_PostalCode',
      'Shipping_Description'
    ];

    const orderControls = [
      'Order_FirstName',
      'Order_LastName',
      'Order_Country',
      'Order_Landmark',
      'Order_State',
      'Order_City',
      'Order_PostalCode',
      'Order_Description'
    ];

    shippingControls.forEach((control, index) => {
      const value = this.checkoutForm.get(control)?.value;
      this.checkoutForm.get(orderControls[index])?.setValue(value);
    });
  }
}