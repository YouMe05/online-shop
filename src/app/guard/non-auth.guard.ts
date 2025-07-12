import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const nonAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const role = sessionStorage.getItem('role');
  
  if (!role) {
    return true;
  }else{
    //admin: เข้าได้เฉพาะ /product-management
    if (role === 'admin') {
      router.navigateByUrl('/product-management');
      return false;
    }
  }

  return false;
};
