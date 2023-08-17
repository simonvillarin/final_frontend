import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  scrolled = false;
  mobile = false;
  home = true;
  about = false;
  services = false;
  contact = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 0;
  }

  toggleMobile = () => {
    this.mobile = !this.mobile;
  };

  onHome = () => {
    this.home = true;
    this.about = false;
    this.services = false;
    this.contact = false;
  };

  onAbout = () => {
    this.home = false;
    this.about = true;
    this.services = false;
    this.contact = false;
  };

  onServices = () => {
    this.home = false;
    this.about = false;
    this.services = true;
    this.contact = false;
  };

  onContact = () => {
    this.home = false;
    this.about = false;
    this.services = false;
    this.contact = true;
  };
}
