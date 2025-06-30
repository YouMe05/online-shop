import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Database, onValue, ref, update } from '@angular/fire/database';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, AdminHeaderComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {
  private db = inject(Database);
  orders: any[] = [];

  ngOnInit() {
    const productsRef = ref(this.db, 'orders');
    onValue(productsRef, snapshot => {
      const data = snapshot.val();

      this.orders = data
      ? Object.entries(data).map(([id, order]: [string, any]) => ({
          id,
          ...order,
          itemsArray: Object.values(order.items) // แปลง object → array
        }))
      : [];
    });
  }

  markAsShipped(orderId: string) {
    const statusRef = ref(this.db, `orders/${orderId}`);
    update(statusRef, { status: 'จัดส่งแล้ว' });
  }
}
