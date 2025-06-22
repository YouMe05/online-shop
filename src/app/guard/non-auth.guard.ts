import { CanActivateFn } from '@angular/router';

export const nonAuthGuard: CanActivateFn = (route, state) => {
  return true;
};
