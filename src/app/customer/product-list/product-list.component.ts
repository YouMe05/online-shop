import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Database, onValue, ref } from '@angular/fire/database';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule,RouterModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  private db = inject(Database);
  products: any;
  selectedCategory: string = 'all';
  
  categoryOptions: string[] = [
    'APPLE PRODUCTS',
    'Laptop',
    'Desktop PC',
    'Monitor',
    'GAMING GEAR',
    'KEYBOARD / MOUSE / PEN TABLET',
    'SPEAKER / HEADSET'
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
    if (this.selectedCategory === 'all') {
      return this.products;
    }

    return this.products.filter(
      (p: any) => p.category === this.selectedCategory
    );
  }
}
