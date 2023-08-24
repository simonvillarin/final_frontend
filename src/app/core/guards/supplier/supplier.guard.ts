import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const supplierGuard: CanActivateFn = (route, state) => {
  const user = localStorage.getItem('user');
  if (user && JSON.parse(user).role === 'Supplier') {
    return true;
  } else {
    const router = inject(Router);
    router.navigate(['/403']);
    return false;
  }
};
