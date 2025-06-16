import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Database, get, ref, set, update } from '@angular/fire/database';
import { ActivatedRoute } from '@angular/router';
import { CartButtonComponent } from '../cart-button/cart-button.component';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, CartButtonComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent {
  private route = inject(ActivatedRoute);
  private db = inject(Database);

  productId: string | null = null;
  product: any = null;
  loading = true;

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');

    if (this.productId) {
      const productRef = ref(this.db, 'products/' + this.productId);
      get(productRef).then(snapshot => {
        this.product = snapshot.val();
        this.loading = false;
      }).catch(err => {
        console.error('Error fetching product:', err);
        this.loading = false;
      });
    }
  }

  addToCart() {
    const cartRef = ref(this.db, 'cart/' + this.productId);

    get(cartRef).then(snapshot => {
      if (snapshot.exists()) {
        // มีสินค้าอยู่แล้ว -> เพิ่ม quantity +1
        const currentData = snapshot.val();
        const updatedQuantity = currentData.quantity + 1;

        update(cartRef, { quantity: updatedQuantity })
        .then(() => {
          console.log('เพิ่มจำนวนสินค้าเรียบร้อย(id)');
        })
        .catch(error => {
          console.error('เกิดข้อผิดพลาดในการอัปเดตตะกร้า:', error);
        });

      } else {
        // ยังไม่มีสินค้า -> เพิ่มเข้าใหม่
        set(cartRef, {
          productId: this.productId,
          quantity: 1
        })
        .then(() => {
          console.log('เพิ่มสินค้าใหม่ในตะกร้าเรียบร้อย');
        })
        .catch(error => {
          console.error('เกิดข้อผิดพลาดในการเพิ่มสินค้า:', error);
        });
      }
    }).catch(error => {
      console.error('เกิดข้อผิดพลาดในการอ่านข้อมูลจาก Firebase:', error);
    });
  }

}
