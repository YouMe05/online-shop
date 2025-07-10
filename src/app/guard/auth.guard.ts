import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const currentUser = sessionStorage.getItem('currentUser');

  if (currentUser) {
    const role = JSON.parse(currentUser)[0].role;
    const targetUrl = state.url;
    if (targetUrl === '/product-management' && role !== 'admin') {
      //ถ้าไม่ใช่ admin
      const backUrl = document.referrer || '/product-list'; // ถ้าไม่มี referrer ให้ fallback เป็น '/profile'
      router.navigateByUrl(backUrl);
      return false;
    }

    if (targetUrl === '/orders' && role !== 'admin') {
      //ถ้าไม่ใช่ admin
      const backUrl = document.referrer || '/product-list'; // ถ้าไม่มี referrer ให้ fallback เป็น '/profile'
      router.navigateByUrl(backUrl);
      return false;
    }

    // ได้รับอนุญาต
    return true;
  } else {
    console.log('Not logged in. Redirecting to login page.');
    //alert('Please log in to access this page.');
    router.navigate(['/product-list']);
    return false;
  }
};
