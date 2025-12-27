import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ReservationComponent implements OnInit {

  loading = false;
  reservationsList: any[] = [];

  form = {
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 4,
    tableType: 'standard',
    notes: ''
  };

  ngOnInit(): void {
    this.fetchReservations();
  }

  fetchReservations(): void {
    this.loading = true;
    // Simulated data - replace with actual API call
    setTimeout(() => {
      this.reservationsList = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1 (555) 123-4567',
          date: new Date(Date.now() + 86400000),
          time: '19:00',
          guests: 4,
          tableType: 'Window Seat',
          notes: 'Celebrating anniversary',
          status: 'Confirmed'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+1 (555) 987-6543',
          date: new Date(Date.now() + 172800000),
          time: '18:30',
          guests: 6,
          tableType: 'Standard',
          notes: '',
          status: 'Pending'
        }
      ];
      this.loading = false;
    }, 500);
  }

  submitReservation(): void {
    if (!this.form.name || !this.form.email || !this.form.date || !this.form.time) {
      return;
    }

    this.loading = true;
    setTimeout(() => {
      const newReservation = {
        id: this.reservationsList.length + 1,
        ...this.form,
        status: 'Pending'
      };
      this.reservationsList.unshift(newReservation);
      this.resetForm();
      this.loading = false;
    }, 500);
  }

  confirmReservation(reservation: any): void {
    reservation.status = 'Confirmed';
  }

  cancelReservation(reservation: any): void {
    const index = this.reservationsList.indexOf(reservation);
    if (index > -1) {
      this.reservationsList.splice(index, 1);
    }
  }

  resetForm(): void {
    this.form = {
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      guests: 4,
      tableType: 'standard',
      notes: ''
    };
  }

  getTotalReservations(): number {
    return this.reservationsList.length;
  }

  getTodayReservations(): number {
    const today = new Date().toDateString();
    return this.reservationsList.filter(
      res => new Date(res.date).toDateString() === today
    ).length;
  }

  getPendingReservations(): number {
    return this.reservationsList.filter(res => res.status === 'Pending').length;
  }
}
