import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { QueueService } from '../../services/queue.service';

@Component({
  standalone: true,
  selector: 'app-manager',
  imports: [CommonModule, MatSnackBarModule],
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit {

  loading = false;
  queueList: any[] = [];
  tablesList: any[] = [];
  recentActivities: any[] = [];

  constructor(
    private queueService: QueueService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    setTimeout(() => {
      this.queueList = [
        { id: 1, name: 'John Doe', party_size: 4, status: 'waiting' },
        { id: 2, name: 'Jane Smith', party_size: 2, status: 'waiting' }
      ];
      this.tablesList = [
        { id: 1, capacity: 6, status: 'occupied' },
        { id: 2, capacity: 4, status: 'available' },
        { id: 3, capacity: 4, status: 'reserved' },
        { id: 4, capacity: 2, status: 'occupied' },
        { id: 5, capacity: 6, status: 'available' },
        { id: 6, capacity: 8, status: 'occupied' }
      ];
      this.recentActivities = [
        { type: 'seat', icon: '👥', title: 'Seated Table 1', time: '2 mins ago' },
        { type: 'queue', icon: '📋', title: 'New customer joined queue', time: '5 mins ago' },
        { type: 'reserve', icon: '📅', title: 'Reservation confirmed', time: '15 mins ago' }
      ];
      this.loading = false;
    }, 300);
  }

  seatNextCustomer(): void {
    if (this.queueList.length === 0) {
      this.snackBar.open('No customers in queue', 'OK', { duration: 3000 });
      return;
    }
    this.loading = true;
    this.queueService.seatCustomer({}).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.snackBar.open(res.message || 'Customer seated successfully', 'OK', { duration: 3000 });
        this.queueList.shift();
      },
      error: (err: any) => {
        this.loading = false;
        const msg = err.error?.message || 'No customers to seat';
        this.snackBar.open(msg, 'Close', { duration: 3000 });
      }
    });
  }

  viewQueue(): void {
    this.snackBar.open('Navigate to Queue page', 'OK', { duration: 2000 });
  }

  viewTables(): void {
    this.snackBar.open('Navigate to Tables page', 'OK', { duration: 2000 });
  }

  viewReservations(): void {
    this.snackBar.open('Navigate to Reservations page', 'OK', { duration: 2000 });
  }

  getQueueCount(): number {
    return this.queueList.length;
  }

  getAvailableTables(): number {
    return this.tablesList.filter(t => t.status === 'available').length;
  }

  getReservedTables(): number {
    return this.tablesList.filter(t => t.status === 'reserved').length;
  }

  getOccupiedTables(): number {
    return this.tablesList.filter(t => t.status === 'occupied').length;
  }

  getOccupancyRate(): number {
    if (this.tablesList.length === 0) return 0;
    return Math.round((this.getOccupiedTables() / this.tablesList.length) * 100);
  }

  getAvgWaitTime(): number {
    return this.queueList.length > 0 ? Math.ceil(this.queueList.length * 2.5) : 0;
  }

  getLongestWait(): number {
    return this.getAvgWaitTime() + (this.queueList.length > 2 ? 10 : 0);
  }
}
