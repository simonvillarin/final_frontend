import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  mobile = false;
  home = true;
  about = false;
  services = false;
  contact = false;
  signUp = false;
  login = false;

  constructor(private router: Router) {}

  toggleMobile = () => {
    this.mobile = !this.mobile;
  };

  onHome = () => {
    this.home = true;
    this.about = false;
    this.services = false;
    this.contact = false;
    this.signUp = false;
    this.login = false;
    this.router.navigate(['/'], { fragment: 'home' });
  };

  onAbout = () => {
    this.home = false;
    this.about = true;
    this.services = false;
    this.contact = false;
    this.signUp = false;
    this.login = false;
    this.router.navigate(['/'], { fragment: 'about' });
  };

  onServices = () => {
    this.home = false;
    this.about = false;
    this.services = true;
    this.contact = false;
    this.signUp = false;
    this.login = false;
    this.router.navigate(['/'], { fragment: 'services' });
  };

  onContact = () => {
    this.home = false;
    this.about = false;
    this.services = false;
    this.contact = true;
    this.signUp = false;
    this.login = false;
    this.router.navigate(['/'], { fragment: 'contact' });
  };

  onSignUp = () => {
    this.home = false;
    this.about = false;
    this.services = false;
    this.contact = false;
    this.signUp = true;
    this.login = false;
    this.router.navigate(['/register']);
  };

  onLogin = () => {
    this.home = false;
    this.about = false;
    this.services = false;
    this.contact = false;
    this.signUp = false;
    this.login = true;
  };
}
