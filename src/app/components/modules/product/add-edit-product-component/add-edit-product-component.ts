import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../catalog-component/models/catalog-component.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClientService } from '../../../../services/http-client-service';
import { HttpClientModule } from '@angular/common/http';
import { API } from '../../../../common/endpoint';

@Component({
  selector: 'app-add-edit-product-component',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './add-edit-product-component.html',
  styleUrl: './add-edit-product-component.css',
  // providers: [HttpClientService]
})
export class AddEditProductComponent {
  @Output() formSubmit = new EventEmitter<Product>();
  product: Product | null = null;
  productForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: ActivatedRoute, private apiService: HttpClientService, private route: Router) {

    router.queryParams.subscribe(para => {
      let id = para["id"];
      if (id != null && id != undefined) {
        this.apiService.get<Product>(API.CATALOG.CRUD + '/' + id).subscribe({
          next: (data) => {
            console.log("Product Data:", data);
            this.product = data;
            this.formLoad();
          },
          error: (err) => console.error('Error loading products', err)
        });
      }

    });

  }

  ngOnInit(): void {
    this.formLoad();
  }

  formLoad() {
    this.productForm = this.fb.group({
      Name: [this.product?.name || '', Validators.required],
      Description: [this.product?.description || '', Validators.required],
      Price: [this.product?.price || 0, [Validators.required, Validators.min(0)]],
      Image: [this.product?.image || ''],
      Categories: this.fb.array(this.product?.categories || [])
    });
  }

  get categories(): FormArray {
    return this.productForm.get('Categories') as FormArray;
  }

  addCategory(category: string) {
    if (category.trim()) {
      this.categories.push(this.fb.control(category.trim()));
    }
  }

  removeCategory(index: number) {
    this.categories.removeAt(index);
  }

  submit() {
    if (this.productForm.valid) {
      const formValue = { ...this.productForm.value } as Product;
      console.log("PAYLOAD:", formValue);
      if (this.product?.id) {
        formValue.id = this.product.id; // Keep the same Id if editing
        this.editProduct(formValue);
      } else {
        formValue.id = null; // Generate new Id if adding
        this.addProduct(formValue);
      }
      // this.formSubmit.emit(formValue);
    }
  }

  addProduct(payload: Product){
    
    this.apiService.post<{id: string}>(API.CATALOG.CRUD, payload).subscribe({
          next: (data) => {
            console.log("Product Data:", data);
            console.log("details:", this.product);
            this.product = payload;
            this.product!.id = data.id;
            this.formLoad();
            alert("Product with id: " + data.id + " saved.")
            this.route.navigate(["/products"]);
          },
          error: (err) => console.error('Error saving products', err)
        });
  }
  
  editProduct(payload: Product){

    this.apiService.put<string>(API.CATALOG.CRUD, payload).subscribe({
          next: (data) => {
            console.log("Product Data:", data);
            this.route.navigate(["/products"]);

            alert(data)
          },
          error: (err) => console.error('Error updating products', err)
        });
  }
}
