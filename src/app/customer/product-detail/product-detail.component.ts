import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Database, get, ref } from '@angular/fire/database';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule],
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
}
