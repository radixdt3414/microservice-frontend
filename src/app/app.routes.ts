import { Routes } from '@angular/router';
import { MainComponent } from './components/layout/main-component/main-component';
import { CatalogComponent } from './components/modules/catalog-component/catalog-component';
import { ListProductComponent } from './components/modules/product/list-product-component/list-product-component';
import { AddEditProductComponent } from './components/modules/product/add-edit-product-component/add-edit-product-component';
import { CartDetailsComponent } from './components/modules/cart/cart-details-component/cart-details-component';
import { CheckoutBasket } from './components/modules/cart/checkout-basket/checkout-basket';
import { WarehouseComponent } from './components/modules/inventory/warehouse-component/warehouse-component';
import { DisplayOrderComponent } from './components/modules/order/display-order-component/display-order-component';
import { LoginComponent } from './components/modules/auth/login-component/login-component';
import { SignupComponent } from './components/modules/auth/signup-component/signup-component';
import { AuthGuard } from './common/AuthGuard';

export const routes: Routes = [

  { path: '', component: CatalogComponent },        // Home/Catalog
  { path: 'orders', component: CatalogComponent },  // Replace with OrdersComponent
  {
    path: 'products',
    canActivate: [AuthGuard],
    component: ListProductComponent,
  },  // Replace with OrdersComponent
  {
    path: 'products/edit',    canActivate: [AuthGuard],
    component: AddEditProductComponent,
  },  // For edit product
  {
    path: 'products/add',canActivate: [AuthGuard],
    component: AddEditProductComponent,
  },  // For add new product
  { path: 'cart',     canActivate: [AuthGuard], component: CartDetailsComponent },     // Replace with CartComponent
  { path: 'cart/checkout', canActivate: [AuthGuard], component: CheckoutBasket },     // Redirect to checkout 
  { path: 'inventory',     canActivate: [AuthGuard], component: WarehouseComponent },     // Stock details
  { path: 'order',     canActivate: [AuthGuard], component: DisplayOrderComponent },    // List all the order details      
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent }
];
