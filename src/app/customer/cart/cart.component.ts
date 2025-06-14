import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Database, get, getDatabase, onValue, ref, remove, set, update } from '@angular/fire/database';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule,RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  private db = inject(Database);
  cartItems: any[] = [];


  ngOnInit() {
    const cartRef = ref(this.db, 'cart');
    const productRef = ref(this.db, 'products');

    // ดึงข้อมูล product ทั้งหมดก่อน
    onValue(productRef, (productSnap) => {
      const products = productSnap.val();

      // แล้วค่อยดึง cart
      onValue(cartRef, (cartSnap) => {
        const cart = cartSnap.val();
        const result: any[] = [];

        for (const productId in cart) {
          const quantity = cart[productId]?.quantity || 0;
          const name = products?.[productId]?.name || 'ไม่พบชื่อสินค้า';
          const price = products?.[productId]?.price || 0;
          const imageUrl = products?.[productId]?.imageUrl || 0;

          result.push({
            id: productId,
            name,
            price,
            imageUrl,
            quantity
          });
        }
        this.cartItems = result;
      });
    });
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
  }

  // เพิ่มจำนวนสินค้า
  increaseQuantity(item: any): void {
    item.quantity++;
    this.updateCartInFirebase(item);
  }

  // ลดจำนวนสินค้า
  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateCartInFirebase(item);
    }
  }

  // ลบสินค้า
  removeItem(item: any): void {
    this.cartItems = this.cartItems.filter(i => i.id !== item.id);
    this.removeFromFirebase(item.id);
  }

  // อัปเดตข้อมูลไปยัง Firebase
  updateCartInFirebase(item: any) {
    const db = getDatabase();
    const cartRef = ref(db, 'cart/' + item.id);
    update(cartRef, { quantity: item.quantity });
  }

  // ลบสินค้าใน Firebase
  removeFromFirebase(productId: string) {
    const db = getDatabase();
    const cartRef = ref(db, 'cart/' + productId);
    remove(cartRef);
  }
}
