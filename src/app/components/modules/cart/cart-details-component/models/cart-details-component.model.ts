// models/cart-item.model.ts
export interface CartItem {
    quentity: number;
    productId: string;
    productName: string;
    color: string;
    price: number;
}

export interface Cart {
    id: string | null;
    userName: string;
    items: CartItem[];
    totalPrice: number; 
}