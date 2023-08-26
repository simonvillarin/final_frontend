import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}

  isUserLoggedIn = () => {
    return localStorage.getItem('user') || false;
  };

  getToken = () => {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user).token;
    }
    return false;
  };

  getUserId = () => {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user).id;
    }
    return false;
  };

  logout = () => {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  };
}
