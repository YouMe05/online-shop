import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Database, onValue, ref, set } from '@angular/fire/database';
import { RouterModule } from '@angular/router';
import { CartButtonComponent } from '../cart-button/cart-button.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterModule, CartButtonComponent,FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  private db = inject(Database);
  products: any[] = [];
  selectedCategory: string = 'all';
  searchText: string = '';
  
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

  ngOnInit() {
    this.getProducts();
  }
  
  getProducts() {
    const productsRef = ref(this.db, 'products');
    onValue(productsRef, snapshot => {
      const data = snapshot.val();
      this.products = data ? Object.values(data) : [];
    });
  }

  filteredProducts() {
    const search = this.searchText.toLowerCase();

    if (this.selectedCategory === 'all' && !this.searchText) {
      // ไม่กรองอะไรเลย
      return this.products;
    }

    if (this.selectedCategory === 'all' && this.searchText) {
      // กรองเฉพาะชื่อ
      return this.products.filter((p: any) =>
        p.name.toLowerCase().includes(search)
      );
    }

    if (this.selectedCategory !== 'all' && !this.searchText) {
      // กรองเฉพาะหมวดหมู่
      return this.products.filter((p: any) =>
        p.category === this.selectedCategory
      );
    }

    // กรองทั้งหมวดหมู่และชื่อ
    return this.products.filter((p: any) =>
      p.category === this.selectedCategory &&
      p.name.toLowerCase().includes(search)
    );
  }

}
 