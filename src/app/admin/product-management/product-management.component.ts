import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Database, onValue, ref, remove, set } from '@angular/fire/database';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';

@Component({
  selector: 'app-product-management',
  imports: [ReactiveFormsModule, CommonModule, AdminHeaderComponent],
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.scss'
})
export class ProductManagementComponent {
  formProductManage!: FormGroup;
  private db = inject(Database);
  imageLinks: string[] = [];
  previewData: any = null;
  products: any;

  editData: any = null;
  formEditProduct!: FormGroup;

  categoryOptions: string[] = [
    'APPLE PRODUCTS',
    'Laptop',
    'Desktop PC',
    'Monitor',
    'GAMING GEAR',
    'KEYBOARD / MOUSE / PEN TABLET',
    'SPEAKER / HEADSET',
    'Hardware'
  ];

  constructor() {
    this.formProductManage = new FormGroup(
      {
        name: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
        price: new FormControl('', Validators.required),
        stock: new FormControl('', Validators.required),
        imageUrl: new FormControl('', Validators.required),
        category: new FormControl('', Validators.required)
      }
    );

    this.formEditProduct = new FormGroup({
      id: new FormControl(''), // สำคัญมากไว้ bind ID
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      stock: new FormControl('', Validators.required),
      imageUrl: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    this.getProducts();
  }

  addProduct() {
    const id = Date.now(); // ใช้ timestamp เป็น ID แทน
    if (this.formProductManage.invalid) return;

    const { name, price, imageUrl, description, stock, category } = this.formProductManage.value;

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
      this.formProductManage.reset(); // ล้างฟอร์ม
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
    const confirmed = window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?');

    if (!confirmed) return;

    const productRef = ref(this.db, 'products/' + productId);
    remove(productRef)
    .then(() => {
      console.log('ลบสินค้าเรียบร้อย');
      this.getProducts(); // โหลดสินค้าใหม่
    })
    .catch(error => {
      console.error('เกิดข้อผิดพลาดในการลบสินค้า:', error);
    });
  }


  showPreview() {
    if (this.formProductManage.invalid) {
      this.formProductManage.markAllAsTouched(); // เพื่อให้ error ขึ้นครบ
      return;
    }

    this.previewData = { ...this.formProductManage.value };
  }

  openEditModal(product: any) {
    this.editData = product;
    this.formEditProduct.patchValue(product);
  }

  updateProduct() {
    if (this.formEditProduct.invalid) return;

    const updated = this.formEditProduct.value;
    const productRef = ref(this.db, 'products/' + updated.id);

    set(productRef, updated)
    .then(() => {
      console.log('Product updated:', updated);
      this.getProducts();
      this.editData = null; // ปิด modal
    })
    .catch((error) => {
      console.error('Error updating product:', error);
    });
  }

  
  get f() {
    return this.formProductManage.controls;
  }

}
