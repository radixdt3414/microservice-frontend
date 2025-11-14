export interface CheckoutModel {
  // Customer Info
  CustomerId: string;      // Guid as string
  TotalPrice: number;
  UserName: string;

  // Payment
  CardNumber: string;
  Cvv: string;
  ExpiryDate: string;      // ISO string, e.g. "2026-12-31"
  PaymentType: string;
  CardMemberName: string;

  // Shipping Address
  Shipping_FirstName: string;
  Shipping_LastName: string;
  Shipping_Country: string;
  Shipping_Landmark: string;
  Shipping_State: string;
  Shipping_City: string;
  Shipping_PostalCode: string;
  Shipping_Description: string;

  // Order Address
  Order_FirstName: string;
  Order_LastName: string;
  Order_Country: string;
  Order_Landmark: string;
  Order_State: string;
  Order_City: string;
  Order_PostalCode: string;
  Order_Description: string;
}
