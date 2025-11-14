import { Product } from "../../../catalog-component/models/catalog-component.model";

export  interface Order {
  id: string | null;
  customerId: string;
  orderName: string;
  orderItems: OrderItem[];
  paymentDetails: Payment;
  orderAddressDetails: Address;
  shippingAddressDetails: Address;
  orderStatus: number;
  totalPrice: number;
  expanded?: boolean;
}

export interface Payment {
  cardNumber: string;
  cvv: string;
  expiryDate: Date;
  paymentType: string;
  cardMemberName: string;
}

export interface OrderItem {
  orderId: string | null;
  quentity: number;
  productId: string;
  price: number;
  productName: string;
  image: string | null| undefined;
  // productDetails?: Product;
}

export interface Address {
  firstName: string;
  lastName: string;
  country: string;
  landmark: string;
  state: string;
  city: string;
  postalCode: string;
  description: string;
}