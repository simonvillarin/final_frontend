import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const landingGuard: CanActivateFn = (route, state) => {
  const user = localStorage.getItem('user');
  if (user) {
    const router = inject(Router);
    if (user && JSON.parse(user).role === 'Admin') {
      router.navigate(['/admin/dashboard']);
    } else if (user && JSON.parse(user).role === 'Supplier') {
      router.navigate(['/supplier/dashboard']);
    } else if (user && JSON.parse(user).role === 'Farmer') {
      router.navigate(['/farmer/dashboard']);
    }
    return false;
  } else {
    return true;
  }
};
