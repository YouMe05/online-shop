import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Database, ref, set, onValue, remove, push } from '@angular/fire/database';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit {
  formHome!: FormGroup;
  private db = inject(Database);
  message = '';
  products: any;
  imageLinks: string[] = [];
  previewData: any = null;

  constructor() {
    this.formHome = new FormGroup(
      {
        name: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
        price: new FormControl('', Validators.required),
        stock: new FormControl('', Validators.required),
        imageUrl: new FormControl('', Validators.required),
        category: new FormControl('', Validators.required)
      }
    );
  }

  ngOnInit() {
    const messageRef = ref(this.db, 'message');
    onValue(messageRef, snapshot => {
      this.message = snapshot.val();
    });
    this.getProducts();
  }

  updateMessage() {
    set(ref(this.db, 'message'), 'Hello from Angular 19!!!!!!!!!');
  }

  addProduct() {
    const id = Date.now(); // ใช้ timestamp เป็น ID แทน
    if (this.formHome.invalid) return;

    const { name, price, imageUrl, description, stock, category } = this.formHome.value;
    const productRef = ref(this.db, 'products/' + id);

    set(productRef, {
      id,
      name,
      description,
      price,
      stock,
      imageUrl,
      category,
    })
    .then(() => {
      console.log('Product added:', { id, name, price, imageUrl, description, stock, category });
      this.getProducts(); // โหลดข้อมูลใหม่
      this.formHome.reset(); // ล้างฟอร์ม
    })
    .catch((error) => {
      console.error('Error adding product:', error);
    });
  }

  getProducts() {
    const productsRef = ref(this.db, 'products');
    onValue(productsRef, snapshot => {
      const products = snapshot.val();
      this.products = products ? Object.values(products) : [];
      console.log('Products:', products);
    });
  }

  deleteProduct(productId: string) {
    const productRef = ref(this.db, 'products/' + productId);
    remove(productRef).then(() => {
      console.log('Product deleted successfully');
      this.getProducts(); // Refresh the product list
    }).catch(error => {
      console.error('Error deleting product:', error);
    });
  }

  showPreview() {
    if (this.formHome.invalid) {
      this.formHome.markAllAsTouched(); // เพื่อให้ error ขึ้นครบ
      return;
    }

    this.previewData = { ...this.formHome.value };
  }

  get f() {
    return this.formHome.controls;
  }
}