import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-header',
  imports: [RouterModule],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.scss'
})
export class AdminHeaderComponent {

  constructor(private router: Router) {}

  logout() {
    sessionStorage.removeItem('currentUser'); // หรือล้างทั้งหมดด้วย sessionStorage.clear();
    this.router.navigate(['/login']);
  }
  
}
