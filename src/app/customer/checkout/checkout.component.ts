import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Database, get, onValue, ref, remove, set, update } from '@angular/fire/database';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  imports: [RouterModule,CommonModule,ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  private db = inject(Database);
  formCheckout !: FormGroup;
  cartItems: any[] = [];
  latestOrderId: number | null = null;
  private router = inject(Router);

  constructor(){
    this.formCheckout = new FormGroup(
      {
        name: new FormControl('', Validators.required),
        address: new FormControl('', Validators.required),
        telephone: new FormControl('', [
          Validators.required,
          Validators.pattern('^[0-9]{10}$'),
        ])
      }
    );
  }

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
          const stock = products?.[productId]?.stock || 0;

          result.push({
            id: productId,
            name,
            price,
            imageUrl,
            stock,
            quantity
          });
        }
        this.cartItems = result;
      });
    });
  }

  getTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  updateOrder() {
    if (this.formCheckout.invalid) {
      this.formCheckout.markAllAsTouched();
      return;
    }

    const updates = [];
    let orderId: number; // Declare orderId in the outer scope

    for (const item of this.cartItems) {
      const productRef = ref(this.db, 'products/' + item.id);

      const updatePromise = get(productRef).then(snapshot => {
        const product = snapshot.val();
        const currentStock = product?.stock ?? 0;

        if (currentStock < item.quantity) {
          throw new Error(`สินค้า "${item.name}" คงเหลือไม่พอ (${currentStock} ชิ้น)`);
        }

        return update(productRef, {
          stock: currentStock - item.quantity
        });
      });

      updates.push(updatePromise);
    }

    Promise.all(updates)
      .then(() => {
        orderId = Date.now(); // Assign value to outer-scoped orderId
        const orderRef = ref(this.db, 'orders/' + orderId);

        const orderData: {
          customer: any,
          items: { [key: string]: { name: string, price: number, imageUrl: string, quantity: number } },
          total: number,
          createdAt: number,
          status: string
        } = {
          customer: this.formCheckout.value,
          items: {},
          total: this.getTotal(),
          createdAt: Date.now(),
          status: 'รอจัดส่ง'
        };

        for (const item of this.cartItems) {
          orderData.items[item.id] = {
            name: item.name,
            price: item.price,
            imageUrl: item.imageUrl,
            quantity: item.quantity
          };
        }

        return set(orderRef, orderData);
      })
      .then(() => {
        // ล้าง cart หลังจากบันทึก order แล้ว
        const cartRef = ref(this.db, 'cart');
        return remove(cartRef);
      })
      .then(() => {
        this.latestOrderId = orderId;
        this.formCheckout.reset();
        this.cartItems = [];
      })
      .catch(err => {
        console.error('❌ เกิดข้อผิดพลาด:', err);
        alert('❌ สั่งซื้อไม่สำเร็จ: ' + err.message);
      });
  }

  copyOrderId() {
    if (this.latestOrderId) {
      navigator.clipboard.writeText(this.latestOrderId.toString()).then(() => {
        alert('คัดลอกเลขคำสั่งซื้อเรียบร้อยแล้ว!');
      }).catch(() => {
        alert('❌ คัดลอกไม่สำเร็จ');
      });
    }
  }

  closeSuccessModal() {
    this.latestOrderId = null;
    this.router.navigate(['/product-list']);
  }

  get f() {
    return this.formCheckout.controls;
  }

}
