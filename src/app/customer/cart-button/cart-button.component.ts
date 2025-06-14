import { Component, inject } from '@angular/core';
import { Database, onValue, ref } from '@angular/fire/database';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart-button',
  imports: [RouterModule],
  templateUrl: './cart-button.component.html',
  styleUrl: './cart-button.component.scss'
})
export class CartButtonComponent {
  private db = inject(Database);
  cartCount: any;

  ngOnInit() {
    const cartRef = ref(this.db, 'cart/');

    onValue(cartRef, (cartSnap) => {
      const cart = cartSnap.val();
      this.cartCount = this.getTotalQuantity(cart);
    });
  }

  getTotalQuantity(cart: any): number {
    let total = 0;
    for (const productId in cart) {
      total += cart[productId]?.quantity || 0;
    }
    return total;
  }

}
