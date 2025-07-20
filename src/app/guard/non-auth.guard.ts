import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const nonAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  try {
    const rawUser = sessionStorage.getItem('currentUser');
    if (rawUser) throw new Error('You still Login as ADMIN. Please Logout.');

    return true;
  } catch (e) {
    alert("You are login as Admin.Please logout before exit this site.");
    console.error('authGuard error:', e);
    router.navigate(['/product-management']);
    return false;
  }
};
