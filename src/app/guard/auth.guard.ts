import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  try {
    const rawUser = sessionStorage.getItem('currentUser');
    if (!rawUser) throw new Error('No currentUser');

    const parsedUser = JSON.parse(rawUser);
    const role = parsedUser?.role ?? parsedUser?.[0]?.role;

    if (!role) {
      console.warn('No role found in currentUser');
      router.navigate(['/product-list']);
      return false;
    }

    const targetUrl = state.url;
    const isAdmin = role === 'admin';

    if (
      ['/product-management', '/orders'].includes(targetUrl) &&
      !isAdmin
    ) {
      const fallback = '/product-list';
      const backUrl = document.referrer?.includes(window.location.origin)
        ? document.referrer
        : fallback;

      router.navigateByUrl(backUrl);
      return false;
    }

    //ผ่าน guard
    return true;
  } catch (e) {
    console.error('authGuard error:', e);
    router.navigate(['/product-list']);
    return false;
  }
};
