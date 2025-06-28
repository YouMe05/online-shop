import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Database, onValue, ref } from '@angular/fire/database';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-check',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './product-check.component.html',
  styleUrl: './product-check.component.scss'
})
export class ProductCheckComponent {
  private db = inject(Database);
  orders: any[] = [];
  formCheckProduct!: FormGroup;
  matchedOrder: any = null;
  notFound = false;

  constructor(){
    this.formCheckProduct = new FormGroup(
      {
        orderID: new FormControl('', Validators.required)
      }
    );
  }

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

  check() {
    const inputId = this.formCheckProduct.get('orderID')?.value?.trim();

    if (!inputId) {
      this.matchedOrder = null;
      this.notFound = true;
      return;
    }

    const found = this.orders.find(order => order.id === inputId);

    if (found) {
      this.matchedOrder = found;
      this.notFound = false;
    } else {
      this.matchedOrder = null;
      this.notFound = true;
    }
  }


}
