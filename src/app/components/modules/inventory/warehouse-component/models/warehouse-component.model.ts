
export interface InventoryItem {
  id: string | null;
  productId: string;
  WarehouseId: string;
  productName: string | null;
  productImage?: string | null;
  quantityOnHand: number;
  quantityReserved: number;
  quantityAvailable: number //{ return this.quantityOnHand - this.quantityReserved; } // computed in template
}

export interface Warehouse {
  id: string;
  name: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  landmark?: string;
  description?: string;
  latitude: number | null;
  longitude: number | null;
  isActive: boolean;
  currentCapacityUnitUsed: number;
  capacityUnit: number;
  inventoryItem: InventoryItem[];
}