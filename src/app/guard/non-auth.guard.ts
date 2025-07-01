import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const nonAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const currentUser = sessionStorage.getItem('currentUser');
  
  if (!currentUser) {
    return true;
  }else{
    const role = JSON.parse(currentUser)[0].role;
    const targetUrl = state.url;

    //admin: เข้าได้เฉพาะ /manage-user
    if (role === 'admin') {
      router.navigateByUrl('/manage-user');
      return false;
    }

    //user: เข้าได้เฉพาะ /profile
    if (role === 'user') {
      router.navigateByUrl('/profile');
      return false;
    }
  }

  return false;
};
