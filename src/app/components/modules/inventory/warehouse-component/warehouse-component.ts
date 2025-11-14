import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InventoryItem, Warehouse } from './models/warehouse-component.model';
import { CatalogListResponse, Product } from '../../catalog-component/models/catalog-component.model';
import { HttpClientService } from '../../../../services/http-client-service';
import { PaginationPayload, PaginationResponse } from '../../../../common/models';
import { API } from '../../../../common/endpoint';

@Component({
  selector: 'app-warehouse-component',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './warehouse-component.html',
  styleUrl: './warehouse-component.css'
})
export class WarehouseComponent {

  // UI state
  warehouses: Warehouse[] = [];
  products: Product[] = [];

  // filtering UI
  searchTerm: string = '';
  selectedWarehouseFilter: string = '';

  // modal state
  modalOpen = false;
  isEdit = false;
  editingWarehouseId: string | null = null;
  editingItemId: string | null = null;


  // small toasts/messages
  message: string | null = null;
  form: FormGroup;
  constructor(private fb: FormBuilder, private api: HttpClientService) {
    // reactive form for add/edit
    this.form = this.fb.group({
      productId: ['', Validators.required],
      quantityOnHand: [1, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadDemoData();

  }

  // ========== Demo data (so UI works out-of-the-box) ==========
  private loadDemoData() {
    
    this.loadProductsFromApi({
      "PageLimit": 0,
      "PageIndex": 1,
      "SortBy": "",
      "SortOrder": "desc"
    });
    // this.products = [
    //   {
    //     id: '1',
    //     name: 'Product 1',
    //     description: 'This is the first product.',
    //     price: 99.99,
    //     image: 'https://picsum.photos/300/200?random=1',
    //     categories: ['Category A', 'Category B'],
    //     discount: null
    //   },
    //   {
    //     id: '2',
    //     name: 'Product 2',
    //     description: 'Second product description.',
    //     price: 149.99,
    //     image: 'https://picsum.photos/300/200?random=2',
    //     categories: ['Category C'],
    //     discount: null
    //   }
    // ];

    // this.warehouses = [
    //   {
    //     id: 'w1',
    //     name: 'North Warehouse',
    //     address: { country: 'USA', state: 'NY', city: 'New York', postalCode: '10001' },
    //     latitude: 40.7128,
    //     longitude: -74.006,
    //     isActive: true,
    //     currentCapacityUnitUsed: 75,
    //     capacityUnit: 100,
    //     inventoryItem: [
    //       { id: 'i1', productId: 'p1', productName: 'MacBook Air M1', productImage: this.products[0].image, quantityOnHand: 10, quantityReserved: 2, quantityAvailable: 8 },
    //       { id: 'i2', productId: 'p2', productName: 'Wireless Headphones', productImage: this.products[1].image, quantityOnHand: 20, quantityReserved: 5, quantityAvailable: 15 }
    //     ]
    //   },
    //   {
    //     id: 'w2',
    //     name: 'West Warehouse',
    //     address: { country: 'USA', state: 'CA', city: 'San Francisco', postalCode: '94103' },
    //     latitude: 37.7749,
    //     longitude: -122.4194,
    //     isActive: false,
    //     currentCapacityUnitUsed: 40,
    //     capacityUnit: 80,
    //     inventoryItem: [
    //       { id: 'i3', productId: 'p3', productName: 'Mechanical Keyboard', productImage: this.products[0].image, quantityOnHand: 5, quantityReserved: 1, quantityAvailable: 4 }
    //     ]
    //   }
    // ];
  }

  // ========== API stubs (optional) ==========
  // Example: load from backend
  private loadProductsFromApi(payload: PaginationPayload) {
    this.api.post<PaginationResponse<CatalogListResponse>>(API.CATALOG.LIST, payload).subscribe({
      next: (data) => {
        console.log("warehouse Data:", data.data);
        this.products = data.data.lstProducts;
        this.products.forEach((item, ind) => {
          item.image = "https://picsum.photos/300/200?random=" + (ind + 1);
        });
        this.loadWarehousesFromApi();
      },
      error: (err) => console.error('Error loading products', err)
    });
  }

  private loadWarehousesFromApi() {
    if (!this.api) return;
    this.api.get<{ warehouses: Warehouse[] }>(API.INVENTORY.CRUD).subscribe({
      next: (data) => {
        console.log("warehouse Data:", data.warehouses);
        this.warehouses = data.warehouses;
        this.warehouses.forEach(warehouse =>{
          warehouse.inventoryItem.forEach(item =>{
            let tempProduct = this.products.find(x => x.id == item.productId);
            item.productImage = tempProduct?.image;
            item.productName = tempProduct?.name ?? "";
          })
        })
      },
      error: (err) => console.error('Error loading warehouse', err)
    });
  }

  // ========== UI helpers ==========
  openAddModal(warehouseId: string) {
    this.isEdit = false;
    this.editingWarehouseId = warehouseId;
    this.editingItemId = null;
    this.form.reset({ productId: '', quantityOnHand: 1 });
    this.modalOpen = true;
  }

  openEditModal(warehouseId: string, item: InventoryItem) {
    this.isEdit = true;
    this.editingWarehouseId = warehouseId;
    this.editingItemId = item.id;
    this.form.setValue({ productId: item.productId, quantityOnHand: item.quantityOnHand });
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.editingWarehouseId = null;
    this.editingItemId = null;
    this.form.reset();
  }

  get filterProduct(){
    if(this.isEdit){
      return this.products;
    }
    else{
      let tempWarehouse = this.warehouses.find(x => x.id == this.editingWarehouseId );
      return this.products.filter(x => {
        let lstProductId = tempWarehouse?.inventoryItem.map(x => x.productId);
        return !lstProductId?.includes(x.id ?? "");
      })
    }
  }

  trackByWarehouseId(index: number, w: Warehouse) { return w.id; }
  trackByItemId(index: number, i: InventoryItem) { return i.id; }

  // Save (Add or Update)
  save() {
    if (this.form.invalid || !this.editingWarehouseId) return;
    const payload = this.form.value;
    const warehouse = this.warehouses.find(w => w.id === this.editingWarehouseId);
    if (!warehouse) return;

    var command = {
      ProductId: payload.productId,
      Quantity: payload.quantityOnHand,
      WarehouseId: this.editingWarehouseId,
      Id: this.editingItemId ?? null
    }

    if (this.api) {
      this.api.post(API.INVENTORY.CRUD, command).subscribe({
        next: (data) => {
          this.notify('Inventory updated');
          this.loadDemoData();
        },
        error: (err) => {
          console.error('Error while updating warehouse', err);
          this.notify('Error while updating warehouse');
          alert("error: "+err.statusText)
        }
      });
    }
    this.closeModal();
  }

  // Delete with confirm
  confirmAndDelete(warehouseId: string, itemId: string) {
    if (!confirm('Are you sure you want to remove this inventory item?')) return;
    const warehouse = this.warehouses.find(w => w.id === warehouseId);
    if (!warehouse) return;
    warehouse.inventoryItem = warehouse.inventoryItem.filter(i => i.id !== itemId);
    this.notify('Inventory item removed');
    if (this.api) {
      this.api.delete(`/warehouses/${warehouseId}/inventory/${itemId}`).subscribe();
    }
  }

  // small notification
  private notify(text: string) {
    this.message = text;
    setTimeout(() => this.message = null, 2500);
  }

  // product display helper
  getProductName(id: string) {
    return this.products.find(p => p.id === id)?.name ?? id;
  }

  // computed counts
  totalInventoryCount(warehouse: Warehouse) {
    return warehouse.inventoryItem.length;
  }

  // // filter helper for UI: filters items by search term
  // filteredItems(warehouse: Warehouse) {
  //   const term = (this.searchTerm || '').trim().toLowerCase();
  //   if (!term) return warehouse.inventoryItem;
  //   return warehouse.inventoryItem.filter(i =>
  //     i.productName.toLowerCase().includes(term) ||
  //     i.productId.toLowerCase().includes(term)
  //   );
  // }
}
