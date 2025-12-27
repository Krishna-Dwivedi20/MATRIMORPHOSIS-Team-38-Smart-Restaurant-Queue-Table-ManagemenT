import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  imports: [CommonModule, RouterModule]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  restaurantLocation = {
    address: '123 Restaurant Ave',
    city: 'Food City',
    state: 'FC',
    zip: '12345',
    coordinates: { lat: 40.7128, lng: -74.0060 }
  };

  navigationLinks = [
    { label: 'Dashboard', route: '/' },
    { label: 'Tables', route: '/tables' },
    { label: 'Queue', route: '/queue' },
    { label: 'Reservations', route: '/reserve' },
    { label: 'Manager', route: '/manager' }
  ];

  supportLinks = [
    { label: 'Help Center', route: '#' },
    { label: 'Documentation', route: '#' },
    { label: 'Contact Support', route: '#' },
    { label: 'FAQ', route: '#' }
  ];

  legalLinks = [
    { label: 'Privacy Policy', route: '#' },
    { label: 'Terms of Service', route: '#' },
    { label: 'Cookie Policy', route: '#' }
  ];

  socialLinks = [
    { icon: '📱', label: 'Facebook', url: '#' },
    { icon: '🐦', label: 'Twitter', url: '#' },
    { icon: '📷', label: 'Instagram', url: '#' },
    { icon: '💼', label: 'LinkedIn', url: '#' }
  ];

  openMap(): void {
    const { address, city, state, zip, coordinates } = this.restaurantLocation;
    const mapUrl = `https://www.google.com/maps/search/${coordinates.lat},${coordinates.lng}`;
    window.open(mapUrl, '_blank');
  }
}
